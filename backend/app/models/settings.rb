class Settings
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :user

  field :theme, type: String, default: "light"
  field :language, type: String, default: "en"
  field :notifications, type: Boolean, default: true
  field :privacy, type: String, default: "private"
end
