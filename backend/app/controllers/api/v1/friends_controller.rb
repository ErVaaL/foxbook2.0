class Api::V1::FriendsController < ApplicationController
  skip_before_action :authorize_request, only: [ :show ]
  before_action :set_service, except: [ :show ]
  before_action :set_user

  def show
    render json: { friends: @user.friends.map { |id| UserSerializer.new(User.find(id)).serializable_hash[:data][:attributes] } }, status: :ok
  end

  def destroy
    result = @service.remove_friend
    render json: result.except(:status), status: result[:status]
  end

  def recieved_friend_requests
    result = @service.recieved_friend_requests
    render json: result.except(:status), status: result[:status]
  end

  def sent_friend_requests
    result = @service.sent_friend_requests
    render json: result.except(:status), status: result[:status]
  end

  private

    def set_service
      @service = initialize_service(FriendServices::FriendsService, friend_id: params[:friend_id] || params[:id])
    end
end
