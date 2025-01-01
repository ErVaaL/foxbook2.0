module FriendServices
  class FriendRequestsService < BaseFriendsService
    def send_request
      return user_not_found_error unless @friend
      return already_friends_error if @current_user.friends.include?(@friend.id)
      return friend_request_already_sent_error if request_already_exists?

      @current_user.send_friend_request(@friend.id)
      @friend.recieve_friend_request(@current_user.id)
      { success: true, message: "Friend request sent", status: :created }
    end

    def accept_request
      return { success: false, error: "No friend request found", status: :not_found } unless @current_user.recieved_friend_request?(@friend.id)
      return already_friends_error if @current_user.friends.include?(@friend.id)

      @current_user.accept_friend_request(@friend.id)
      @friend.add_friend(@current_user.id)
      @friend.remove_sent_request(@current_user.id)

      { success: true, message: "Friend request accepted", status: :accepted }
    end

    def decline_request
      return { success: false, error: "No friend request found", status: :not_found } unless @current_user.recieved_friend_request?(@friend.id)
      return { success: false, error: "Not friends", status: :bad_request } unless @current_user.friends.include?(@friend.id)

      @current_user.remove_recieved_request(@friend.id)
      @friend.remove_sent_request(@current_user.id)

      { success: true, message: "Friend request declined", status: :ok }
    end

    private

      def request_already_exists?
        @current_user.sent_friend_request?(@friend.id) || @current_user.recieved_friend_request?(@friend.id)
      end
  end
end
