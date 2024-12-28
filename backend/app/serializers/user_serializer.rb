class UserSerializer
  include JSONAPI::Serializer
  attributes :first_name, :last_name, :username, :email, :phone
end
