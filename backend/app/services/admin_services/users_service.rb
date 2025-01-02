class AdminServices::UsersService < ApplicationService
  def initialize(current_user)
    super(current_user)
    @user_service = initialize_service(UserServices::UsersService)
    @profile_service = initialize_service(ProfileServices::ProfileService)
  end
  def get_users
    { success: true, users: users, status: :ok }
  end

  def get_user(user_id)
    user = User.find(user_id)
    { success: true, user: user, status: :ok }
  rescue Mongoid::Errors::DocumentNotFound
    { success: false, error: "User not found", status: :not_found }
  end

  def update_user(user_id, user_params = nil, profile_params = nil)
    return { success: false, error: "No data to change provided", status: :bad_request } if user_params.blank? && profile_params.blank?
    return not_the_same_user_error unless @current_user.id == user_id || @current_user.role == "admin"
    user = User.find(user_id)
    return { success: false, error: "User not found", status: :not_found } unless user
    user.update!(user_params) if user_params.present?

    profile = user.profile
    profile.update!(profile_params) if profile_params

    { success: true, message: "Data successfully updated", details: ProfileSerializer.new(profile).serializable_hash, status: :accepted }
  rescue Mongoid::Errors::DocumentNotFound
    { success: false, error: "User not found", status: :not_found }
  rescue StandardError => e
    { success: false, error: "Failed to update user", details: e.message, status: :unprocessable_entity }
  end

  def delete_user(user_id)
    return { success: false, error: "User not found", status: :not_found } unless User.exists?(user_id)
    @user_service.delete_user(user_id)
    { success: true, message: "User deleted successfully", status: :no_content }
  end
end
