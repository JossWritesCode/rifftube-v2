require 'streamio-ffmpeg'

class RiffsController < ApplicationController
    # not needed because disabled for whole app
    #skip_before_action :verify_authenticity_token

    # GET	/photos	photos#index	display a list of all photos
    # URL: GET /riffs?video_id=xxx[&user_id={"self", yyy}]
    def index
        user = params[:user_id]
        video = params[:video_id]
        if user.present? and video.present?
            if user == "self"
                if logged_in?
                    #riffs = @current_user.videos.find_by(url: video)&.riffs.as_json&.each { |r| r.delete("audio") }
                    #riffs = Video.find_by(url: video).riffs.where(user: @current_user).except("audio")
                    riffs = Video.find_by(url: video)&.riffs.where(user: @current_user).as_json
                        &.each { |r|
                            r.delete("audio")
                            r["name"] = User.find(r["user_id"]).name;
                        }
                    render json: (riffs or [])
                else
                    render plain: "Not logged in", status: :unauthorized
                end
            else
                #riffs = User.find(params[user]).videos.find_by(url: video)&.riffs.as_json&.each { |r| r.delete("audio") }
                riffs = Video.find_by(url: video).riffs.where(user: user).as_json
                    &.each { |r|
                        r.delete("audio")
                        r["name"] = User.find(r["user_id"]).name;
                    }
                render json: (riffs or [])
            end
        elsif video.present?
            # TODO: !! set up cache of user names
            riffs = Video.find_by(url: video)
                &.riffs
                .as_json
                &.each { |r|
                    r.delete("audio")
                    r["name"] = User.find(r["user_id"]).name;
                }
            render json: (riffs or [])
        else
            render plain: "Unable to load riffs", status: :internal_server_error
        end 
    end

    #   GET	/photos/new	photos#new	return an HTML form for creating a new photo
    def new
        @video_id = params[:video_id]
        @riff = Riff.new
        render layout: false
    end

    # POST	/photos	photos#create	create a new photo
    def create
        # check if logged in

        if logged_in?

            recode_audio
            params[:riff][:user_id] = @current_user.id
            vid_url = params[:riff][:video_id];
            video = Video.find_by(url: vid_url)
            if video.nil?
                VideoInfo.provider_api_keys = { youtube: ENV["YOUTUBE_DATA_API"] }
                vidinf = VideoInfo.new("http://www.youtube.com/watch?v=#{vid_url}")

                video = Video.new
                video.url = vid_url
                video.title = vidinf.title
                video.duration = vidinf.duration
                video.host = "youtube.com"
                if not video.save
                    render plain: "Error saving riff, creating video record", status: :internal_server_error and return
                end
            end
            params[:riff][:video_id] = video.id
            
            puts "FOOBAR"
            puts riff_params
            #puts params[:riff][:riff_kind]

            @riff = Riff.new(riff_params)

            #@riff.riff_kind = params[:riff][:riff_kind]

            #puts @riff.inspect
            puts "FOOBARt"
            puts params[:riff][:riff_kind]
            puts @riff.inspect

            if @riff.save
                # used to avoid duplicating commands
                output = @riff.attributes.except("audio").merge({"timestamp" => params[:timestamp]})
                render json: output
                braodcast_update_riff vid_url, output
            else
                render plain: "Error saving riff", status: :internal_server_error
            end

        else
            render plain: "Not logged in", status: :unauthorized
        end
    end

    #  GET	/photos/:id	photos#show	display a specific photo
    def show
        riff = Riff.find(params[:id])
        send_data riff.audio
    end

    # GET	/photos/:id/edit	photos#edit	return an HTML form for editing a photo
    # URL: riffs/:id/edit
    def edit
        @id = params[:id]
        @riff = Riff.find(@id)
        #params[:riff_kind] = @riff.riff_kind
        #puts "set at"
        #puts @riff.riff_kind
        render layout: false
    end

    # PATCH	/photos/:id	photos#update	update a specific photo
    # URL: PATCH /riffs/xxx[?fields=yyy[,zzz]]
    def update
        if logged_in?
            riff = Riff.find(params[:id])

            puts riff.inspect

            return render plain: "Unauthorized", status: :unauthorized if @current_user.id != riff.user_id

            if params[:fields].present?
                # 'audio' field not allowed currently
                puts params.inspect
                fields = params[:fields].split(",")
                fields.each { |field|
                    puts "field: #{field} = #{params[field.to_sym]}"
                    riff[field.to_sym] = params[field.to_sym]
                }
                if riff.save
                    # timestamp used to avoid duplicating commands
                    output = riff.attributes.except("audio").merge({"timestamp" => params[:timestamp]})
                    render json: output
                    braodcast_update_riff riff.video.url, output
                else
                    render plain: "Error updating riff", status: :internal_server_error
                end
            else
                recode_audio
                puts "audio type"
                puts riff_params[:riff_kind]
                riff.riff_kind = riff_params[:riff_kind].to_i
                puts riff.riff_kind
                puts riff.inspect
                #debugger
                if riff.update(riff_params)
                    # timestamp used to avoid duplicating commands
                    output = riff.attributes.except("audio").merge({"timestamp" => params[:timestamp]})
                    render json: output
                    braodcast_update_riff riff.video.url, output
                else
                    render plain: "Error updating riff", status: :internal_server_error
                end
            end
        else
            render plain: "Not logged in", status: :unauthorized
        end
    end

    # DELETE	/photos/:id	photos#destroy	delete a specific photo
    def destroy
        if logged_in?
            riff = Riff.find(params[:id])
            riff.destroy

            vid_url = riff.video.url

            # websocket broadcast
            ActionCable.server.broadcast(
                "video:#{vid_url}",
                {
                    from: @current_user.id,
                    cmd: "delete",
                    id: riff.id
                }
            )
        end
    end

end


private
def riff_params
  #params[:user][:email].downcase!
  params.require(:riff).permit(:id, :audio, :text, :start, :duration, :user_id, :video_id, :riff_kind, :showText, :autoDuration, :voice)
end

def recode_audio
    # skip if there is no audio to recode
    return if not params[:riff][:audio]

    puts "recorde audio length"
    puts File.size(params[:riff][:audio].tempfile.path)

    return if File.size(params[:riff][:audio].tempfile.path) == 0

    movie = FFMPEG::Movie.new(params[:riff][:audio].tempfile.path)
    riff_path = "#{Rails.root}/tmp/riff-#{@current_user.id}-#{Time.now.to_i}.mp4"
    movie.transcode(riff_path) 
    mp4data = File.read(riff_path)
    params[:riff][:audio] = mp4data 
    File.delete(riff_path); # should be ok, data already read in 
end

def braodcast_update_riff(vid_url, riff)
    # websocket broadcast
    puts "broadcast #{vid_url}/#{riff}/#{@current_user}"
    ActionCable.server.broadcast(
        "video:#{vid_url}",
        {
            from: @current_user.id,
            cmd: "update",
            riff: riff
        }
    )
end