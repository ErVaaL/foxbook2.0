class Api::V1::FriendsController < ApplicationController
  before_action :authorize_request
  before_action :set_user

  def show
    render json: { friends: @user.friends.map { |id| User.find(id) } }, status: :ok
  end

  def destroy
    friend = User.find(params[:friend_id])

    if !@user.friends.include?(friend.id) or @user.friends.empty?
      render json: { error: "Not friends" }, status: :bad_request
      return
    end

    if @user.remove_friend(friend.id) && friend.remove_friend(@user.id)
      render json: { message: "Friend removed" }, status: :accepted
    else
      render json: { error: "Failed to remove friend" }, status: :bad_request
    end
  end
end
