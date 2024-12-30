class MembershipSerializer
  include JSONAPI::Serializer

  attributes :role, :created_at

  attribute :user do |membership|
    {
      id: membership.user.id.to_s,
      username: membership.user.username,
      email: membership.user.email
    }
  end
end
