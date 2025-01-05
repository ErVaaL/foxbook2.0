module FriendServices
  class FriendsService < BaseFriendsService
    def remove_friend
      return { success: false, error: "No friend found" } unless @current_user.friends.include?(@friend.id)

      @current_user.remove_friend(@friend.id)
      @friend.remove_friend(@current_user.id)

      { success: true, message: "Friend removed" }
    end

    def recieved_friend_requests
      requests = @current_user.friend_requests_recieved
      { success: true, requests: requests.map { |id| UserSerializer.new(User.find(id)).serializable_hash[:data][:attributes] } }
    end

    def sent_friend_requests
      requests = @current_user.friend_requests_sent
      { success: true, requests: requests.map { |id| UserSerializer.new(User.find(id)).serializable_hash[:data][:attributes] } }
    end
  end
end
