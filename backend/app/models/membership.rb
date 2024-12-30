class Membership
  include Mongoid::Document
  include Mongoid::Timestamps

  field :role, type: String, default: "member"

  belongs_to :user
  belongs_to :group

  validates :role, inclusion: { in: %w[owner moderator member] }
end
