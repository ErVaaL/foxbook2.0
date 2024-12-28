class User
  include Mongoid::Document
  include Mongoid::Timestamps
  include ActiveModel::SecurePassword

  field :first_name, type: String
  field :last_name, type: String
  field :username, type: String
  field :email, type: String
  field :phone, type: String
  field :password_digest, type: String

  has_secure_password

  validates :first_name, presence: true, length: { minimum: 3, maximum: 20 }
  validates :last_name, presence: true, length: { minimum: 3, maximum: 20 }
  validates :username, presence: true, uniqueness: true, length: { minimum: 3, maximum: 20 }
  validates :phone, presence: true, uniqueness: true, length: { minimum: 9, maximum: 9 }, numericality: { only_integer: true }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
end
