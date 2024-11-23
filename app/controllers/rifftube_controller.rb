require 'tempfile'
require 'zip'

RiffTrack = Struct.new(:cursor, :riffs)

class RifftubeController < ApplicationController

  def index
    puts "rendering rifftube index"
    render file: "#{Rails.root}/public/index.html", layout: false
  end

  def video_list
    vids = Video.where(host: params[:host])
    hash = vids.as_json
    hash&.each { |v| v["count"] = Video.find(v["id"]).riffs.count }
    hash = hash&.sort { |a,b| b["count"] <=> a["count"] }
    render json: hash
  end

  # not working
  # TODO: fix
  def random_video
    puts "random vid"
    vid = Video.first
    redirect_to "/riff/#{vid.url}"
  end

  def riffs_for_video
    riffs = Video.find_by(url: params[:video_id])&.riffs.select(:id, :user_id, :duration, :start, :isText, :text)
    if riffs.nil?
      render json: { "body" => [], "status" => "ok" }
    end
    # convert records to hash; don't include audio data; add name of riffer
    riffs = riffs.map{ |r|
      ret = r.as_json(except: :audio)
      ret["name"] = r.user.name
      ret
    }
    render json: { "body" => riffs, "status" => "ok" }
  end

  def riffs_for_video_current_user
    if logged_in?
      video = @current_user.videos.find_by(url: params[:video_id])
      if video.present?
        riffs = video.riffs.select(:id, :user_id, :duration, :start, :isText, :text)
        # convert records to hash; don't include audio data; add name of riffer
        riffs = riffs.map{|r| ret = r.as_json(except: :audio); ret["name"] = r.user.name; ret}
        ret = { "body" => riffs, "status" => "ok" }
        render json: ret
      else
        ret = { "body" => [], "status" => "ok" }
        render json: ret
      end
    else
      render plain: "not logged in", status: :unauthorized
    end
  end

  def send_email
    UserMailer.with(user: nil).new_user_email.deliver_later
  end

  def riff
    @video = Video.find_by(url: params[:video_id])
  end

  def riff_zip
    video = Video.where(url: params[:video_id]).first
    user = User.find(params[:user_id])
    riffs = Riff.where(user_id: user.id, video_id: video.id)

    zipfile = Tempfile.new('rifftube')
    zipfile.close

    Zip::File.open(zipfile.path, create: true) do |zf|
      riffs.each do |riff|
        zf.get_output_stream("riff" + riff.id.to_s + ".mp4") { |f| f.write riff.audio.to_s }
      end
    end

    zip_data = File.read(zipfile.path)

    send_data zip_data
  end

  def riff_single_file
    video = Video.where(url: params[:video_id]).first
    user = User.find(params[:user_id])
    riffs = Riff.where(user_id: user.id, video_id: video.id)

    download = Download.new
    download.status = "Creating file"
    download.save
    @id = download.id

    render :riff_single_file

    Thread.new do
      Rails.application.executor.wrap do
        
        # pick out audio riffs and sort by start time
        riffs = riffs.filter { |e| !e.isText }
        riffs = riffs.sort_by(&:start)

        # concatenate silence and riffs

        cursor = 0
        last_file = 0
        file_ind = 0

        while riffs.length > 0
          riff_track = [RiffTrack.new(cursor, [riffs.shift()])]
          track_N = 1 # tracks with riff_tracks

          # get at least 20 riffs, or as many as are left
          i = 0
          while i < 20 && riffs.length > 0
            r = riffs.shift()
            # starting with track 0, skip tracks where r won't fit
            # if none work, make a new one
            j = 0
            while j < track_N and r.start < riff_track[j].cursor
              j += 1
            end
            if j < track_N
              riff_track[j].riffs.push(r)
              riff_track[j].cursor = r.start + r.duration
            else
              new_track = RiffTrack.new(r.start + r.duration, [r])
              riff_track.push(new_track)
              track_N += 1
            end
            i += 1
          end

          # check for riffs that should be left for the next file too
          c = 0
          for i in (track_N - 1).downto(1)
            r = riff_track[i].riffs.last
            if r.start + r.duration > riff_track[0].cursor
              riffs.unshift(r)
              c += 1
            end
          end

          # check for additional riffs that need to be included
          # this should be changed so that these riffs are also included
          # on the next file / riff set
          i = c
          while i < riffs.length and riffs[i].start < riff_track[0].cursor
            r = riffs[i]
            if r.start + riff.duration <= riff_track[0].cursor
              riffs.delete_at(i)
            else
              i += 1
            end
            j = 1
            while j < track_N and r.start < riff_track[j].cursor
              j += 1
            end
            if j < track_N
              riff_track[j].riffs.push(r)
              riff_track[j].cursor = r.start + r.duration
            else
              new_track = RiffTrack.new(r.start + r.duration, [r])
              riff_track.push(new_track)
              track_N += 1
            end
          end

          # use files and  info to generate commands for each track
          input_files = ""
          trim_commands = ""
          silences = [""] * track_N
          seqs = [""] * track_N
          sub_curs = [cursor] * track_N
          mix_inputs = ""
          g_ind = 0
          track_commands = ""
          for j in 0...track_N
            riff_track[j].riffs.each_with_index do |riff, ind|
              file = Tempfile.new(binmode: true)
              file.write(riff.audio.to_s)
              file.close()

              input_files << " -i #{file.path}"
              # if riff started before this section, trim it
              trimmed_name = ""
              if riff.start < cursor
                trim_commands << "[#{g_ind}:a]atrim=start=#{cursor - riff.start}[trimmed#{g_ind}]; "
                trimmed_name = "trimmed#{g_ind}"
              end
              #debugger
              # silence may be 0 length (due to timing? or because of trimming)
              silences[j] += "aevalsrc=exprs=0:d=#{[riff.start - sub_curs[j], 0].max}[silence#{j}-#{ind}]; "
              seqs[j] += "[silence#{j}-#{ind}] [#{trimmed_name == "" ?  "#{g_ind}:a" : trimmed_name}] "
              sub_curs[j] = riff.start + riff.duration
              g_ind += 1
            end

            n = riff_track[j].riffs.count * 2 # silence + riff
            #debugger
            track_commands << "#{silences[j]}#{file_ind == 0 ? "" : "[0:a] "}#{seqs[j]}concat=n=#{file_ind == 0 ?
              n : n + 1}:v=0:a=1[out#{track_N == 1 ? "" : j}a]#{track_N == 1 ? "" : ";"} "
            mix_inputs << "[out#{j}a]"
          end

          # the first track (0) determines how long this current segment runs
          cursor = riff_track[0].cursor

          #puts "====="
          #puts trim_commands
          #for i in 0...track_N do
          #  puts input_files[i]
          #  puts silences[i]
          #  puts seqs[i]
          #  puts "====="
          #end

          #`ffmpeg -y -i #{file.path} -filter_complex "aevalsrc=exprs=0:d=#{riff.start}[silence], [silence] [0:a] concat=n=2:v=0:a=1[outa]" -map [outa] /tmp/mixing#{ind.to_s}.mp4`
          #`ffmpeg -y #{input_files[i]} \
          #  -filter_complex "#{silences}#{seqs}concat=n=#{n}:v=0:a=1[outa]" -map [outa] \
          #  #{Rails.root}/tmp/mixing#{file_ind}.mp4`
          puts "====="
          puts trim_commands
          puts track_commands
          puts "====="
          ffmpeg_command = "ffmpeg -y " +
            "#{file_ind == 0 ? "" :
              "-i #{Rails.root}/tmp/mixing#{file_ind - 1}.mp4 "} " +
            "#{input_files} " +
            "-filter_complex \"#{trim_commands}#{track_commands}" +
              "#{track_N == 1 ? "" :
                "#{mix_inputs}amix=inputs=#{track_N}:duration=first:dropout_transition=0:normalize=0[outa]"}\" " +
            "-map [outa] #{Rails.root}/tmp/mixing#{file_ind}.mp4"
          puts ffmpeg_command
          puts "====="

          `#{ffmpeg_command}`

          #`ffmpeg -y \
          #  #{file_ind == 0 ? "" :
          #    "-i #{Rails.root}/tmp/mixing#{file_ind - 1}.mp4 "} \
          #  #{input_files[i]} \
          #  -filter_complex "#{trim_commands} #{track_commands} \
          #    #{track_N == 1 ? "" :
          #      "#{mix_inputs}amix=inputs=#{track_N}:duration=first:dropout_transition=0:normalize=0[outa]"}" \
          #    -map [outa] #{Rails.root}/tmp/mixing#{file_ind}.mp4`

          last_file = file_ind
          file_ind += 1
        end
        single_data = File.read("#{Rails.root}/tmp/mixing#{last_file}.mp4");
        download.data = single_data
        download.status = "File ready"
        download.save
      end
    end
  end

  def download
    download = Download.find(params[:id])
    if download.data.nil?
      @status = download.status
      render :download
    else
      send_data download.data
    end
  end

end
