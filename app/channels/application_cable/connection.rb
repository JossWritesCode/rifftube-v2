module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      puts "AC connect: #{find_verified_user}"
      self.current_user = find_verified_user
    end

    private
      def find_verified_user
        if current_user = User.find_by(id: cookies.signed[:user_id])
          current_user
        else
          nil
        end
      end

  end
end
