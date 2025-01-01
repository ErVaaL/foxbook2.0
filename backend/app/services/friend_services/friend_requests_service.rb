module FriendServices
  class FriendRequestsService < BaseFriendsService
    def send_request
      unless @friend
        return user_not_found_error
      end
      return already_friends_error if @current_user.friends.include?(@friend.id)
      return friend_request_already_sent_error if request_already_exists?

      @current_user.send_friend_request(@friend.id)
      @friend.recieve_friend_request(@current_user.id)
      { success: true, message: "Friend request sent" }
    end

    def accept_request
      return { success: false, error: "No friend request found" } unless @current_user.recieved_friend_request?(@friend.id)

      @current_user.accept_friend_request(@friend.id)
      @friend.add_friend(@current_user.id)
      @friend.remove_sent_request(@current_user.id)

      { success: true, message: "Friend request accepted" }
    end

    def decline_request
      return { success: false, error: "No friend request found" } unless @current_user.recieved_friend_request?(@friend.id)

      @current_user.remove_recieved_request(@friend.id)
      @friend.remove_sent_request(@current_user.id)

      { success: true, message: "Friend request declined" }
    end

    private

      def request_already_exists?
        @current_user.sent_friend_request?(@friend.id) || @current_user.recieved_friend_request?(@friend.id)
      end
  end
end
