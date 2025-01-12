module FriendServices
  class FriendRequestsService < BaseFriendsService
    def friend_send_request
      @notification_service = initialize_service(NotificationsServices::NotificationsService)
      return user_not_found_error unless @friend
      return already_friends_error if @current_user.friends.include?(@friend.id)
      return friend_request_already_sent_error if request_already_exists?

      @current_user.send_friend_request(@friend.id)
      @friend.recieve_friend_request(@current_user.id)

      @notification_service.create_notification(
        user_id: @friend.id,
        type: "friend_request",
        content: {
                  sender_id: @current_user.id,
                  sender_name: @current_user.username,
                  message: "You recieved friend request from #{@current_user.username}"
                 }
      )

      { success: true, message: "Friend request sent", status: :created }
    end

    def accept_request
      @notification_service = initialize_service(NotificationsServices::NotificationsService)
      return { success: false, error: "No friend request found", status: :not_found } unless @current_user.recieved_friend_request?(@friend.id)
      return already_friends_error if @current_user.friends.include?(@friend.id)

      @current_user.accept_friend_request(@friend.id)
      @friend.add_friend(@current_user.id)
      @friend.remove_sent_request(@current_user.id)

      update_notification_on_action(@current_user.id, @friend.id, "friend_request")

      @notification_service.create_notification(
        user_id: @friend.id,
        type: "friend_request_accepted",
        content: { message: "You and #{@current_user.username} are now friends!" }
      )

      { success: true, message: "Friend request accepted", status: :accepted }
    end

    def decline_request
      return { success: false, error: "No friend request found", status: :not_found } unless @current_user.recieved_friend_request?(@friend.id)

      @current_user.remove_recieved_request(@friend.id)
      @friend.remove_sent_request(@current_user.id)

      update_notification_on_action(@current_user.id, @friend.id, "friend_request")

      { success: true, message: "Friend request declined", status: :ok }
    end

    private

      def request_already_exists?
        @current_user.sent_friend_request?(@friend.id) || @current_user.recieved_friend_request?(@friend.id)
      end

      def update_notification_on_action(user_id, sender_id, type)
        notification = Notification.find_by(
          user_id: user_id,
          "content.sender_id" => sender_id,
          type: type
        )
        notification.update!(content: notification.content.merge("action_taken" => true)) if notification
      end
  end
end
