module FriendServices
  class FriendsService < BaseFriendsService
    def remove_friend
      return { success: false, error: "No friend found" } unless @current_user.friends.include?(@friend.id)

      @current_user.remove_friend(@friend.id)
      @friend.remove_friend(@current_user.id)

      { success: true, message: "Friend removed" }
    end
  end
end
