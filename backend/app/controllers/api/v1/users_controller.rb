class Api::V1::UsersController < ApplicationController
  skip_before_action :authorize_request, only: [ :create, :posts, :groups, :events ]
  before_action :set_service

  def create
    user_params = needed_params(:user, [ :first_name, :last_name, :username, :birthday, :email, :phone, :password, :password_confirmation ])
    result = @service.create_user(user_params)
    render json: result.except(:status), status: result[:status]
  end

  def update
    user_params = needed_params(:user, [ :first_name, :last_name, :username, :birthday, :email, :phone ])
    result = @service.update_user(params[:id], user_params)
    render json: result.except(:status), status: result[:status]
  end

  def posts
    result = @service.get_user_posts(params[:id])
    render json: result.except(:status), status: result[:status]
  end

  def groups
    set_optional_user
    result = @service.get_user_groups(params[:id], @current_user)
    render json: result.except(:status), status: result[:status]
  end

  def events
    result = @service.get_user_events(params[:id])
    render json: result.except(:status), status: result[:status]
  end

  private
    def set_service
      @service = initialize_service(UserServices::UsersService)
    end
end
