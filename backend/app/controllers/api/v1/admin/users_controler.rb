class Api::V1::Admin::UsersController < ApplicationController
  before_action :authorize_request
  before_action :authorize_admin
  before_action :set_service
  before_action :set_user_params, only: [ :update ]

  def index
    result = @service.get_users
    render json: result.except(:status), status: result[:status]
  end

  def show
    result = @service.get_user(params[:id])
    render json: result.except(:status), status: result[:status]
  end

  def update
    result = @service.update_user(params[:id], @user_params, @profile_params)
    render json: result.except(:status), status: result[:status]
  end

  def destroy
    result = @service.delete_user(params[:id])
    render json: result.except(:status), status: result[:status]
  end

  private

    def set_service
      @service = initialize_service(AdminServices::UsersService)
    end

    def set_user_params
      @user_params = needed_params(:user, [ :first_name, :last_name, :username, :age, :email, :phone, :password_digest, :role ])
      @profile_params = needed_params(:profile, [ :description, :birthday, address: [ :country, :state, :city ] ])
    end
end
