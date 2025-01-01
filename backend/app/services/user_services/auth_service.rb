module UserServices
  class AuthService < BaseUsersService
    def login_user(auth_params)
      user = User.find_by(email: auth_params[:email])
      if user && user.authenticate(auth_params[:password])
        token = issue_token(user)
        { success: true, message: "User logged in successfully", user: user, token: token }
      else
        { success: false, error: "Invalid email or password" }
      end
    end

    def logout_user(token)
      { success: false, error: "No token provided" } unless token

      BlackListedToken.create!(token: token, user: @current_user)
      { success: true, message: "Logged out" }
    rescue ActiveRecord::RecordInvalid => e
      { success: false, error: "Logout failed: #{e.message}" }
    end
  end
end
