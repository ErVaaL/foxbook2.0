class Report
  include Mongoid::Document
  include Mongoid::Timestamps

  field :reported_user_id, type: BSON::ObjectId
  field :reporter_id, type: BSON::ObjectId
  field :type, type: String
  field :reason, type: String, default: ""
  field :status, type: String, default: "open"

  belongs_to :reported_user, class_name: "User", foreign_key: :reported_user_id
  belongs_to :reporter, class_name: "User", foreign_key: :reporter_id
  belongs_to :post, optional: true
  belongs_to :comment, optional: true

  validates :type, presence: true, inclusion: { in: [ "Toxic Behavior", "Inappropriate Content", "Bullying" ] }
end
