class Api::V1::FriendsController < ApplicationController
  before_action :authorize_request
  before_action :set_user
  before_action :set_service, only: [ :destroy ]

  def show
    render json: { friends: @user.friends.map { |id| UserSerializer.new(User.find(id)).serializable_hash[:data][:attributes] } }, status: :ok
  end

  def destroy
    result = @service.remove_friend
    render json: result.except(:status), status: result[:status]
  end

  private

    def set_service
      @service = initialize_service(FriendServices::FriendsService, friend_id: params[:friend_id] || params[:id])
    end
end
