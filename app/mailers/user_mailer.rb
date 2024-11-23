class UserMailer < ApplicationMailer
    def new_user_email
      @user = params[:user]
      uc = UserConfirmation.new
      uc.user_id = @user.id
      uc.save
      @uuid = uc.id
  
      mail(to: "paxfeline@gmail.com", subject: "Welcome to RiffTube!") # will change to: @user.email
    end    
end
