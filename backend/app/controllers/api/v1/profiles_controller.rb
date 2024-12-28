class Api::V1::ProfilesController < ApplicationController
  before_action :authorize_request
  before_action :set_user

  def show
    profile = @user.profile

    if profile
      render json: ProfileSerializer.new(profile).serializable_hash, status: :ok
    else
      render json: { error: "Profile not found" }, status: :not_found
    end
  end

  def update
    profile = @user.profile
    if profile.update(profile_params)
      render json: ProfileSerializer.new(profile).serializable_hash, status: :accepted
    else
      render json: { error: "Failed to update profile", details: profile.errors.full_messages }, status: :bad_request
    end
  end

  def destroy
    @current_user.destroy
    render json: { message: "User deleted" }, status: :accepted
  end

  private

    def set_user
      @user = User.find(params[:user_id])
    rescue Mongoid::Errors::DocumentNotFound
      render json: { error: "User not found" }, status: :not_found
    end

    def profile_params
      params.require(:profile).permit(:description, :birthday, address_attributes: [ :street, :city, :state ])
    end
end
