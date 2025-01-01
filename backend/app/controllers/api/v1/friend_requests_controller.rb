class Api::V1::FriendRequestsController < ApplicationController
  before_action :authorize_request
  before_action :set_service, only: [ :create, :update, :destroy ]

  def index
    render json: { friend_requests: @current_user.friend_requests_recieved.map { |id| User.find(id) } }, status: :ok
  end

  def create
    result = @service.send_request
    render json: result.except(:status), status: result[:status]
  end

  def update
    result = @service.accept_request
    render json: result.except(:status), status: result[:status]
  end

  def destroy
    result = @service.decline_request
    render json: result.except(:status), status: result[:status]
  end

  private

    def set_service
      @service = initialize_service(FriendServices::FriendRequestsService, friend_id: params[:friend_id] || params[:id])
    end
end
