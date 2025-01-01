module UserServices
  class BaseUsersService < ApplicationService
    def issue_token(user)
      payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
      secret_key = Rails.application.credentials.jwt_key
      JWT.encode(payload, secret_key, "HS256")
    end
  end
end
