class Api::V1::AuthController < ApplicationController
  skip_before_action :authorize_request, only: [ :login ]
  before_action :authorize_request, only: [ :logout ]

  def login
    auth_params = needed_params(:user, [ :email, :password ])
    user = User.find_by(email: auth_params[:email])
    if user && user.authenticate(auth_params[:password])
      token = issue_token(user)
      render json: { user: UserSerializer.new(user).serializable_hash[:data][:attributes], jwt: token }, status: :accepted
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def logout
    token = request.headers["Authorization"]&.split(" ")&.last
    return render json: { error: "No token provided" }, status: :unauthorized unless token

    BlackListedToken.create!(token: token, user: @current_user)
    render json: { message: "Logged out" }, status: :accepted

  rescue ActiveRecord::RecordInvalid => e
    render json: { error: "Logout failed: #{e.message}" }, status: :internal_server_error
  end
end
