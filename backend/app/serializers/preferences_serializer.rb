class PreferencesSerializer
  include JSONAPI::Serializer
  attributes :friend_recommendations, :group_recommendations, :stranger_invites
end
