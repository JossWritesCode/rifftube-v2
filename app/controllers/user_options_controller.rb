class UserOptionsController < ApplicationController
  before_action :set_user_options, only: %i[ show edit ]

  # GET /user_options/1
  def show
    render json: @user_options.as_json
  end

  # GET /user_options/1/edit
  def edit
    render layout: false
  end

  # PATCH/PUT /user_options/1 or /user_options/1.json
  def update
    if logged_in?
      @user_options = @current_user.user_options
      if @user_options.nil?
        @user_options = UserOptions.new
        @user_options.user = @user
        @user_options.save
      end
      if @user_options.update(user_options_params)
        render json: @user_options.as_json, status: :ok
      else
        render json: @user_options.errors, status: :unprocessable_entity
      end
    else
      #render json: [@current_user.id, params[:id]]
      render plain: "Not authorized", status: :unauthorized
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_options
      if logged_in?
        @user_options = @current_user.user_options
        if @user_options.nil?
          @user_options = UserOptions.new
          @user_options.user = @current_user
          @user_options.save
        end
      end
    end

    # Only allow a list of trusted parameters through.
    def user_options_params
      params.require(:user_options).permit(:user_id, :auto_duration_word_rate, :auto_duration_constant, :avatar_mode, :always_speak_text, :default_voice, :pause_to_riff, :play_after_riff, :immediate_save)
    end
end
