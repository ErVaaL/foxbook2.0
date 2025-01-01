class Api::V1::UsersController < ApplicationController
  skip_before_action :authorize_request, only: [ :create ]
  before_action :set_service

  def create
    user_params = needed_params(:user, [ :first_name, :last_name, :username, :age, :email, :phone, :password, :password_confirmation ])
    result = @service.create_user(user_params)
    render json: result, status: result[:success] ? :created : :bad_request
  end

  private
    def ensure_json_request
      render json: { error: "Only JSON requests ar accepted" }, status: 406 unless request.format.json?
    end

    def set_service
      @service = UserServices::UsersService.new
    end
end
