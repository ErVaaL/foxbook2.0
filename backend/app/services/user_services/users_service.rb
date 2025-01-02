module UserServices
  class UsersService < BaseUsersService
    def create_user(user_params)
      existing_user = User.where(email: user_params[:email]).first
      return { success: false, error: "User already exists", details: [ "Email is already taken" ], status: :conflict } if existing_user

      user = User.new(user_params)
      if user.save
        token = issue_token(user)
        { success: true, message: "User registered successfully", user: user, token: token, status: :created }
      else
        { success: false, error: "Failed to create user", details: user.errors.full_messages, status: :bad_request }
      end
    end

    def update_user(user_id, user_params)
      user = User.find_by(id: user_id)
      return { success: false, error: "User not found", status: :not_found } unless user
      return { success: false, error: "Failed to update user", details: user.errors.full_messages, status: :bad_request } unless user.update(user_params)
      { success: true, message: "User updated successfully", user: user, status: :ok }
    end

    def delete_user(user_id)
      user = User.find_by(id: user_id)
      return { success: false, error: "User not found", status: :not_found } unless user
      return { success: false, error: "Failed to delete user", status: :internal_server_error } unless user.handle_delete_user
      { success: true, message: "User deleted successfully", status: :no_content }
    rescue Mongoid::Errors::DocumentNotFound
      { success: false, error: "User not found", status: :not_found }
    end
  end
end
