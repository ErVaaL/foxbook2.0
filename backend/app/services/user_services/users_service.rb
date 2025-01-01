module UserServices
  class UsersService < BaseUsersService
    def create_user(user_params)
      existing_user = User.where(email: user_params[:email]).first
      if existing_user
        return { success: false, error: "User already exists", details: [ "Email is already taken" ] }
      end

      user = User.new(user_params)
      if user.save
        token = issue_token(user)
        { success: true, message: "User registered successfully", user: user, token: token }
      else
        { success: false, error: "Failed to create user", details: user.errors.full_messages }
      end
    end
  end
end
