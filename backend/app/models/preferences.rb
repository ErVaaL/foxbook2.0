class Preferences
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :user

  field :friend_recommendations, type: Boolean, default: true
  field :group_recommendations, type: Boolean, default: true
  field :stranger_invites, type: Boolean, default: true
end
