class Api::V1::FriendRequestsController < ApplicationController
  before_action :authorize_request

  def index
    render json: { friend_requests: @current_user.friend_requests_recieved.map { |id| User.find(id) } }, status: :ok
  end

  def create
    friend = User.find(params[:friend_id])

    if @current_user.friends.include?(friend.id)
      render json: { error: "Already friends" }, status: :bad_request
      return
    end

    if @current_user.sent_friend_request?(friend.id) || @current_user.recieved_friend_request?(friend.id)
      render json: { error: "Friend request already sent" }, status: :bad_request
      return
    end

    @current_user.send_friend_request(friend.id)
    friend.recieve_friend_request(@current_user.id)

    render json: { message: "Friend request sent" }, status: :created
  end

  def update
    friend = User.find_by(id: params[:id])
    Rails.logger.debug("id: #{params[:id]}")

    if @current_user.recieved_friend_request?(friend.id)
      @current_user.accept_friend_request(friend.id)
      friend.add_friend(@current_user.id)
      friend.remove_sent_request(@current_user.id)

      render json: { message: "Friend request accepted" }, status: :accepted
    else
      render json: { error: "No friend request found" }, status: :not_found
    end
  end

  def destroy
    friend = User.find(params[:id])

    if @current_user.recieved_friend_request?(friend.id)
      @current_user.remove_recieved_request(friend.id)
      friend.remove_sent_request(@current_user.id)

      render json: { message: "Friend request declined" }, status: :accepted
    else
      render json: { error: "No friend request found" }, status: :not_found
    end
  end
end
