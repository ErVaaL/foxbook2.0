class UserSerializer
  include JSONAPI::Serializer
  attributes :id, :role, :first_name, :last_name, :username, :birthday, :email, :phone, :avatar, :friends, :friend_requests_sent, :friend_requests_recieved

  attribute :settings do |user|
    {
      privacy: user.settings&.privacy || "private",
      notifications: user.settings&.notifications.nil? ? true : user.settings.notifications
    }
  end
end
