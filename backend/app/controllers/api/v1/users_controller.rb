class Api::V1::UsersController < ApplicationController
  skip_before_action :authorized, only: [ :create ]

  def create
    @user = User.new(user_params)
    if @user.save
      token = issue_token({ user_id: @user.id })
      render json: { message: "User registered successfully", user: @user, token: token }, status: :created
    else
      render json: { error: "Failed to create user", details: @user.errors.full_messages }, status: :bad_request
    end
  end


  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

  def ensure_json_request
  render json: { error: "Only JSON requests ar accepted" }, status: 406 unless request.format.json?
  end
end
