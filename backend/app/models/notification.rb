class Notification
  include Mongoid::Document
  include Mongoid::Timestamps

  field :type, type: String
  field :content, type: Hash, default: {}
  field :was_seen, type: Boolean, default: false

  belongs_to :user

  index({ user_id: 1, was_seen: 1 })
  index({ created_at: -1 })

  validates :type, presence: true
  validates :user_id, presence: true

  scope :unseen, -> { where(was_seen: false) }
  scope :by_user, ->(user_id) { where(user_id: user_id) }

  def switch_was_seen
    self.update(was_seen: !self.was_seen)
  end
end
