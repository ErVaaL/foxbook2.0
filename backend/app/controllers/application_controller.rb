class ApplicationController < ActionController::API
  before_action :authorized

  SECRET_KEY = Rails.application.credentials.jwt_key

  def issue_token(user)
    JWT.encode(user, SECRET_KEY, "HS256")
  end

  def decoded_token
    if request.headers["Authorization"]
      token = request.headers["Authorization"].split(" ").last
      begin
        JWT.decode(token, SECRET_KEY, true, { algorithm: "HS256" })
      rescue JWT::DecodeError
        nil
      end
    end
  end

  def current_user
    if decoded_token
      user_id = decoded_token[0]["user_id"]
      @current_user ||= User.find_by(user_id)
    end
  end

  def logged_in?
    !!current_user
  end

  def authorized
    render json: { message: "Unauthorized" }, status: :unauthorized unless logged_in?
  end
end
