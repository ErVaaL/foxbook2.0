class GroupSerializer
  include JSONAPI::Serializer
  attributes :name, :description, :is_public, :created_at, :updated_at
  attribute :owner do |group|
    {
      id: group.owner.id.to_s,
      username: group.owner.username,
      email: group.owner.email
    }
  end
end
