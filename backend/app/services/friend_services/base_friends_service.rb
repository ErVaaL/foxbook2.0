module FriendServices
  class BaseFriendsService < ApplicationService
    def initialize(current_user:, friend_id: nil)
      @current_user = current_user
      @friend = friend_id ? User.find_by(id: friend_id) : nil
    rescue Mongoid::Errors::DocumentNotFound
      user_not_found_error
    end

    private

      def already_friends_error
        { success: false, error: "Already friends", status: :bad_request }
      end

      def friend_request_already_sent_error
        { success: false, error: "Friend request already sent", status: :conflict }
      end
  end
end
