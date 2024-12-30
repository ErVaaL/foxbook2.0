class UserSerializer
  include JSONAPI::Serializer
  attributes :first_name, :last_name, :username, :age, :email, :phone, :friends, :friend_requests_sent, :friend_requests_recieved
end
