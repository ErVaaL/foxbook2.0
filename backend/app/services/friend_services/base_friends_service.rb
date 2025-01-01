module FriendServices
  class BaseFriendsService
    def initialize(current_user:, friend_id: nil)
      @current_user = current_user
      @friend = friend_id ? User.find_by(id: friend_id) : nil
    end

    private

      def user_not_found_error
        { success: false, error: "User not found" }
      end

      def already_friends_error
        { success: false, error: "Already friends" }
      end

      def friend_request_already_sent_error
        { success: false, error: "Friend request already sent" }
      end
  end
end
