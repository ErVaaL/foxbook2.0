class ProfileSerializer
  include JSONAPI::Serializer

  attributes :description, :birthday

  attribute :address do |profile|
    {
     country: profile.address&.country,
     state: profile.address&.state,
     city: profile.address&.city
    }
  end

  attribute :user do |profile|
    {
      id: profile.user.id.to_s,
      first_name: profile.user.first_name,
      last_name: profile.user.last_name,
      username: profile.user.username,
      email: profile.user.email,
      phone: profile.user.phone,
      age: profile.user.age
    }
  end
end
