class BlackListedToken
  include Mongoid::Document
  include Mongoid::Timestamps
  field :token, type: String
  belongs_to :user
  validates :token, presence: true, uniqueness: true
end
