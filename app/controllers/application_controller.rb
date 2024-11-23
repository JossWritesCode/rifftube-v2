class ApplicationController < ActionController::Base
    skip_forgery_protection
    helper_method :current_user, :logged_in?

    def current_user
        # used to use ||=
        @current_user = User.find_by_id(session[:user_id]) if session[:user_id]
    end

    def logged_in?
        !!current_user
    end
    
    def require_user
        if !logged_in?
            flash[:alert] = "You must be logged in to perform that action."
            redirect_to login_path
        end
    end

    # TODO: change to NotifChannel?
    # or remove? unused?
    #def broadcast_notification(riff)
    #    NotifChannel.broadcast_to(
    #        current_user,
    #        command: 'new',
    #        id: riff.id
    #    )
    #end

end
