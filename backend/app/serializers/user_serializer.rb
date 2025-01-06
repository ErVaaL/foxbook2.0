class UserSerializer
  include JSONAPI::Serializer
  attributes :id, :first_name, :last_name, :username, :birthday, :email, :phone, :avatar, :friends, :friend_requests_sent, :friend_requests_recieved
end
