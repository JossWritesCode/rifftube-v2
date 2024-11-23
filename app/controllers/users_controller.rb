require 'googleauth'

class UsersController < ApplicationController
  helper_method :obfuscate_email

  def index
    render json: User.all.sort { |a,b| b.riffs.count <=> a.riffs.count }.to_json(:only => [:id,:name])
  end

  def new
    @user = User.new
  end

  def create_with_token
    begin
      # TODO: use ENV variable
      payload = Google::Auth::IDTokens.verify_oidc google_login_credentials, aud: "941154439836-s6iglcrdckcj6od74kssqsom58j96hd8.apps.googleusercontent.com"
      print payload
      print payload["email"].downcase
      # check for user in the db with this email
      params[:user][:email] = payload["email"].downcase
      #params[:user][:confirmed] = true # doesn't work with OG users; decided didn't want anyway
      #existing_user.confirmed = true # creation with google = auto confirmed (good idea?)
      create_helper
    rescue => e
      render plain: "User creation failed. Google auth token failed to verify.", status: :internal_server_error
    end
  end

  def create
    # check for user in the db with this email
    params[:user][:email].downcase!
    params[:user][:confirmed] = false
    create_helper
  end

  def create_helper
    existing_user = User.find_by(email: user_params[:email])
    if existing_user.nil?
      # if user doesn't exist, create a new one
      @user = User.new(user_params)
      print @user.inspect
      if @user.save
        flash[:notice] = "User created."
        UserMailer.with(user: @user).new_user_email.deliver_later
        render plain: "User created.", status: :ok
      else
        print @user.errors.full_messages
        flash.now[:notice] = "User save failed. (1) Error(s): #{@user.errors.full_messages}"
        render plain: "User save failed. (1)\nError(s): #{@user.errors.full_messages}", status: :internal_server_error
      end
    elsif existing_user.password_digest.nil?
      # if user exists, update password
      #puts params.inspect
      #puts user_params.inspect
      #puts "pw? #{params[:user][:password]}"
      existing_user.password_digest = BCrypt::Password.create(params[:user][:password])
      @user = existing_user
      if @user.save
        flash[:notice] = "OG User created."
        UserMailer.with(user: @user).new_user_email.deliver_later
        render plain: "OG User created.", status: :ok
      else
        print @user.errors.full_messages
        flash.now[:notice] = "User save failed. (2) Error(s): #{@user.errors.full_messages}"
        render plain: "User save failed. (2)\nError(s): #{@user.errors.full_messages}", status: :internal_server_error
      end
    else
      flash.now[:notice] = "User creation failed. (3) User already exists."
      render plain: "User creation failed. (3)\nUser already exists.", status: :internal_server_error
    end
  end

  def show
    @user = User.find(params[:id])
    vids = @user.videos.uniq
      .map { |v| v.as_json.merge({"count" => v.riffs.where(user: @user).count}) }
      &.sort { |a,b| b["count"] <=> a["count"] }
    render json: { "name": @user.name, "body": vids }
  end

  def confirm
    uuid = params[:uuid]
    uc = UserConfirmation.find_by_id(uuid)
    @found = uc != nil
    if @found
      @user = User.find(uc.user_id)
      @user.confirmed = true
      if @user.save
        render plain: "Email confirmed. Thank you!", status: :ok
      else
        render plain: "Email confirmation error.", status: :internal_server_error
        puts @user.errors.full_messages
      end
    end
  end

  def reissue_confirm
    if logged_in?
      user = @current_user
      UserMailer.with(user: user).new_user_email.deliver_later
      render plain: "New confirmation code sent.", status: :ok
    else
      render plain: "Not logged in", status: :unauthorized
    end
  end

  def get_pic
    user = User.find_by(id: params[:id])
    print "get pic"
    print user.inspect
    if user&.riff_pic.present?
      send_data user.riff_pic, :type => "image/png", :disposition => "inline"
    else
      send_file "#{Rails.root}/public/images/default_pic.png", :disposition => "inline"
    end
  end

  def set_pic
    if logged_in?
      user = @current_user
      #puts params[:image].inspect

      img = params[:image].tempfile
      img_data = File.read(img.path)

      user.riff_pic = img_data
      if user.save
        render plain: "Updated", status: :ok
      else
        render plain: "Error saving pic", status: :internal_server_error
      end
    else
      render plain: "Not logged in", status: :unauthorized
    end
  end

  def set_name
    if logged_in?
      user = @current_user
      user.name = params[:name]
      if user.save
        render plain: "Updated", status: :ok
      else
        render plain: "Error saving pic", status: :internal_server_error
      end
    else
      render plain: "Not logged in", status: :unauthorized
    end
  end

  def status
    puts "checking status"
    if logged_in?
      puts "logged in"
      render json: @current_user.to_json(except: [:riff_pic, :password_digest])
    else
      puts "not logged in"
      render plain: "Not logged in", status: :unauthorized
    end
  end

  def video_list
    if params[:id] == "self"
      if logged_in?
        user = @current_user
      else
        render plain: "Unauthorized", status: :unauthorized and return
      end
    else
      user = User.find(params[:id])
    end
    vids = user.videos.where(host: params[:host]).uniq # Video.where(id: params[:id], host: params[:host])
    hash = vids.map { |v| v.as_json.merge({"count" => v.riffs.where(user: user).count}) }
    #hash = vids.as_json
    #hash&.each { |v| v["count"] = Video.find(v["id"]).riffs.count }
    hash = hash&.sort { |a,b| b["count"] <=> a["count"] }
    render json: hash
  end

  def grade
    if logged_in?
      grader = @current_user
      gradee = User.find_by(id: params[:id])
      if gradee.present?
        if grader != gradee
          grade = UserGrade.find_by(grader: grader, gradee: gradee)
          if grade.nil?
            grade = UserGrade.new
            grade.grader = grader
            grade.gradee = gradee
          end
          render json: grade
        else
          render plain: "N/A.", status: :bad_request
        end
      else
        render plain: "Invalid gradee id", status: :unauthorized
      end
    else
      render plain: "Not logged in", status: :unauthorized
    end
  end

  def set_grade
    if logged_in?
      grader = @current_user
      gradee = User.find_by(id: params[:id])
      if gradee.present?
        if grader != gradee
          grade = UserGrade.find_by(grader: grader, gradee: gradee)
          if grade.nil?
            grade = UserGrade.new
            grade.grader = grader
            grade.gradee = gradee
          end
          grade.grade = params[:grade]
          if grade.save
            render json: grade
          else
            render plain: "Error saving grade", status: :internal_server_error
          end
        else
          render plain: "Not allowed.", status: :bad_request
        end
      else
        render plain: "Invalid gradee id", status: :unauthorized
      end
    else
      render plain: "Not logged in", status: :unauthorized
    end
  end

private
  def user_params
    #params[:user][:email].downcase!
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :riff_pic, :confirmed)
  end

  def obfuscate_email(email)
    email_parts = email.split('@')
    email_parts[0] = email_parts[0][0..3] + "***"
    @email = email_parts.join('@')
  end

  def google_login_credentials
    params.require(:credentials)
    #params.require(:credentials).permit(:search)
  end
end
