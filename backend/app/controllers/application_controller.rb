class ApplicationController < ActionController::API
  before_action :authorize_request

  SECRET_KEY = Rails.application.credentials.jwt_key

  def issue_token(user)
    payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
    JWT.encode(payload, SECRET_KEY, "HS256")
  end

  def decoded_token
    header = request.headers["Authorization"]
    token = header.split(" ")&.last
    return nil unless token

    begin
      JWT.decode(token, SECRET_KEY, true, { algorithm: "HS256" })[0]
    rescue JWT::DecodeError
      nil
    end
  end

  def current_user
    @current_user ||= User.find(decoded_token["user_id"]) if @decoded_token
  end

  def logged_in?
    !!@current_user
  end

  def authorize_request
    header = request.headers["Authorization"]
    token = header&.split(" ")&.last
    return render_unauthorized("No token provided") unless token

    begin
      decoded = JWT.decode(token, SECRET_KEY, true, { algorithm: "HS256" })[0]

      if BlackListedToken.exists?(token: token)
        return render_unauthorized("Token has been revoked")
      end

      @current_user = User.find_by(id: decoded["user_id"])
    rescue JWT::ExpiredSignature
      render_unauthorized("Expired token")
    rescue JWT::DecodeError
      render_unauthorized("Invalid token")
    end
  end

  def set_optional_user
    header = request.headers["Authorization"]
    token = header&.split(" ")&.last

    return unless token.present?

    begin
      decoded = JWT.decode(token, SECRET_KEY, true, { algorithm: "HS256" })[0]
      unless BlackListedToken.exists?(token: token)
        @current_user = User.find_by(id: decoded["user_id"])
      end
    rescue JWT::ExpiredSignature
      nil
    rescue JWT::DecodeError
      nil
    end
  end

  def authorize_admin
    unless @current_user&.role == "admin" || @current_user&.role == "superadmin"
      render json: { error: "Must be admin to perforn this operation" }, status: :forbidden
    end
  end

  def initialize_service(service_class, params = {})
    if params.is_a?(Hash)
      service_class.new(@current_user, **params)
    else
      service_class.new(@current_user, params)
    end
  end

  def set_user
    @user = User.find(params[:user_id])
  rescue Mongoid::Errors::DocumentNotFound
    render json: { error: "User not found" }, status: :not_found
  end

  def set_post
    @post = Post.find(params[:post_id] || params[:id])
  rescue Mongoid::Errors::DocumentNotFound
    render json: { error: "Post not found" }, status: :not_found
  end

  def needed_params(head_param, params_to_permit)
    params.require(head_param).permit(*params_to_permit)
  end


  private

    def render_unauthorized(message)
      render json: { error: message }, status: :unauthorized
    end
end
