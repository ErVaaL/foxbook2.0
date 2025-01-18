require "jwt"

module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    rescue JWT::DecodeError
      reject_unauthorized_connection
    rescue Mongoid::Errors::DocumentNotFound
      reject_unauthorized_connection
    end

    private

      def find_verified_user
        token = request.cookies["cable_token"]

        return reject_unauthorized_connection unless token

        decoded_token = decode_jwt(token)
        user = User.find_by(id: decoded_token["user_id"])

        if user
          user
        else
          reject_unauthorized_connection
        end
      end

      def decode_jwt(token)
        secret_key = Rails.application.credentials.jwt_key || ENV["JWT_SECRET_KEY"]
        JWT.decode(token, secret_key, true, algorithm: "HS256").first
      rescue JWT::DecodeError
        {}
      end
  end
end
