class Group
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :description, type: String
  field :is_public, type: Boolean, default: true

  belongs_to :owner, class_name: "User", inverse_of: :owned_groups
  has_many :memberships, dependent: :destroy

  index({ name: "text", description: "text" })

  validates :name, presence: true, uniqueness: true, length: { minimum: 3, maximum: 30 }
  validates :description, presence: true

  def add_member_to_group(user, role = "member")
    existing_membership = Membership.where(group: self, user: user).first
    return { success: false, error: "User already in group" } if existing_membership

    self.memberships.create!(user: user, role: role)
    { success: true, message: "User added to group" }
  rescue Mongoid::Errors::Validations => e
    { success: false, error: e.message }
  end

  def remove_member_from_group(user)
    membership = Membership.where(group: self, user: user).first
    return { success: false, error: "User not in group" } unless membership

    membership.destroy
    { success: true, message: "User removed from group" }
  end
end
