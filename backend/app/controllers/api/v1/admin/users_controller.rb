class Api::V1::Admin::UsersController < ApplicationController
  before_action :authorize_request
  before_action :authorize_admin
  before_action :set_service
  before_action :set_user_params, only: [ :update ]

  def index
    page = params[:page].presence || 1
    per_page = params[:per_page].presence || 10
    result = @service.get_users(page.to_i, per_page.to_i)
    render json: result.except(:status), status: result[:status]
  end


  def show
    result = @service.get_user(params[:id])
    render json: result.except(:status), status: result[:status]
  end

  def update
    result = @service.user_update(params[:id], @user_params)
    render json: result.except(:status), status: result[:status]
  end

  def destroy
    result = @service.user_delete(params[:id])
    render json: result.except(:status), status: result[:status]
  end

  private

    def set_service
      @service = initialize_service(AdminServices::UsersService)
    end

    def set_user_params
      @user_params = needed_params(:user, [ :first_name, :last_name, :username, :birthday, :email, :phone, :password_digest, :role ])
    end
end
