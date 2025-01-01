module UserServices
  class BaseUsersService < ApplicationService
    def initialize(current_user:)
      @current_user = current_user
    end
    def issue_token(user)
      payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
      secret_key = Rails.application.credentials.jwt_key
      JWT.encode(payload, secret_key, "HS256")
    end
  end
end
