class Profile
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :user

  field :description, type: String

  embeds_one :address, class_name: "Address"
  accepts_nested_attributes_for :address

  index({ "address.country" => "text", "address.state" => "text", "address.city" => "text" })
end
