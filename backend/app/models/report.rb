class Report
  include Mongoid::Document
  include Mongoid::Timestamps

  field :type, type: String
  field :reason, type: String, default: ""
  field :status, type: String, default: "open"

  belongs_to :reported_user, class_name: "User", foreign_key: "reported_user_id", optional: true
  belongs_to :reporter, class_name: "User", foreign_key: "reporter_id", optional: true
  belongs_to :post, optional: true
  belongs_to :comment, optional: true

  validates :type, inclusion: { in: %w[toxic_behaviour inappropriate_content bullying], message: "%{value} is not a valid type" }
end
