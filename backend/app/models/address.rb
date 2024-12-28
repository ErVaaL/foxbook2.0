class Address
  include Mongoid::Document

  field :country, type: String
  field :state, type: String
  field :city, type: String

  embedded_in :profile
end
