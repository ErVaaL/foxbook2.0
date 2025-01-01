class Api::V1::AuthController < ApplicationController
  skip_before_action :authorize_request, only: [ :login ]
  before_action :authorize_request, only: [ :logout ]
  before_action :set_service

  def login
    auth_params = needed_params(:user, [ :email, :password ])
    result = @service.login_user(auth_params)
    render json: result, status: result[:success] ? :ok : :unauthorized
  end

  def logout
    token = request.headers["Authorization"]&.split(" ")&.last

    result = @service.logout_user(token)
    render json: result, status: result[:success] ? :ok : :unauthorized

  rescue ActiveRecord::RecordInvalid => e
    render json: { error: "Logout failed: #{e.message}" }, status: :internal_server_error
  end

  private

    def set_service
      @service = initialize_service(UserServices::AuthService)
    end
end
