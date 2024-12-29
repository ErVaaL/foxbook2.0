class Api::V1::UsersController < ApplicationController
  skip_before_action :authorize_request, only: [ :create ]

  def create
    user_params = needed_params(:user, [ :first_name, :last_name, :username, :age, :email, :phone, :password, :password_confirmation ])
    existing_user = User.where(email: user_params[:email]).first
    if existing_user
      render json: { error: "User already exists", details: [ "Email is already taken" ] }, status: :conflict
      return
    end

    @user = User.new(user_params)
    if @user.save
      token = issue_token(@user)
      render json: { message: "User registered successfully", user: @user, token: token }, status: :created
    else
      render json: { error: "Failed to create user", details: @user.errors.full_messages }, status: :bad_request
    end
  end

  private
    def ensure_json_request
      render json: { error: "Only JSON requests ar accepted" }, status: 406 unless request.format.json?
    end
end
