# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
    def new_user_email
        # Set up a temporary order for the preview
    
        UserMailer.with(user: nil).new_user_email
    end
end
