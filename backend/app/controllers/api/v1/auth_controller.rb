class Api::V1::AuthController < ApplicationController
  skip_before_action :authorized, only: [ :create ]

  def create
    user = User.find_by(email: auth_params[:email])
    if user && user.authenticate(auth_params[:password])
      token = issue_token(user)
      render json: { user: UserSerializer.new(user), jwt: token }, status: :accepted
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  private

  def auth_params
  params.require(:user).permit(:email, :password)
  end
end
