class Profile
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :user

  field :description, type: String
  field :birthday, type: Date

  embeds_one :address, class_name: "Address"
  accepts_nested_attributes_for :address
end
