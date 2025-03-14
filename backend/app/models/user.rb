class User
  include Mongoid::Document
  include Mongoid::Timestamps
  include ActiveModel::SecurePassword

  field :first_name, type: String
  field :last_name, type: String
  field :username, type: String
  field :email, type: String
  field :birthday, type: Date
  field :phone, type: String
  field :password_digest, type: String
  field :avatar, type: String, default: "/src/assets/default-profile.png"
  field :role, type: String, default: "user"

  field :friends, type: Array, default: []
  field :friend_requests_recieved, type: Array, default: []
  field :friend_requests_sent, type: Array, default: []


  has_one :profile, dependent: :destroy
  has_one :settings, class_name: "Settings", dependent: :destroy
  has_one :preferences, class_name: "Preferences", dependent: :destroy

  has_many :memberships, dependent: :destroy
  has_many :posts, dependent: :destroy
  has_many :notifications, dependent: :destroy

  has_and_belongs_to_many :events, class_name: "Event", inverse_of: :attendees

  index({ first_name: "text", last_name: "text", username: "text" })
  index({ user_id: 1, was_seen: 1 })
  index({ created_at: -1 })


  has_secure_password

  validates :first_name, presence: true, length: { minimum: 3, maximum: 20 }
  validates :last_name, presence: true, length: { minimum: 3, maximum: 20 }
  validates :username, presence: true, uniqueness: true, length: { minimum: 3, maximum: 20 }
  validate :valid_birthday
  validates :phone, presence: true, uniqueness: true, length: { minimum: 9, maximum: 9 }, numericality: { only_integer: true }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  after_create :create_blank_profile
  after_create :create_default_settings
  after_create :create_default_preferences

  def admin?
    self.role == "admin" || self.role == "superadmin"
  end

  def superadmin?
    self.role == "superadmin"
  end

  def add_friend(friend_id)
    self.friends << friend_id unless self.friends.include?(friend_id)
    self.save
  end

  def remove_friend(friend_id)
    self.friends.delete(friend_id)
    self.save
  end

  def sent_friend_request?(friend_id)
    self.friend_requests_sent.include?(friend_id)
  end

  def send_friend_request(friend_id)
    unless sent_friend_request?(friend_id)
      self.friend_requests_sent << friend_id unless self.friend_requests_sent.include?(friend_id)
      self.save
    end
  end

  def recieved_friend_request?(friend_id)
    self.friend_requests_recieved.include?(friend_id)
  end

  def recieve_friend_request(friend_id)
    unless recieved_friend_request?(friend_id)
      self.friend_requests_recieved << friend_id unless self.friend_requests_recieved.include?(friend_id)
      self.save
    end
  end

  def remove_recieved_request(friend_id)
    if recieved_friend_request?(friend_id)
      self.friend_requests_recieved.delete(friend_id)
      self.save
    end
  end

  def remove_sent_request(friend_id)
    if sent_friend_request?(friend_id)
      self.friend_requests_sent.delete(friend_id)
      self.save
    end
  end

  def accept_friend_request(friend_id)
    if recieved_friend_request?(friend_id)
      self.friend_requests_recieved.delete(friend_id)
      self.add_friend(friend_id)
      self.save
    end
  end

  def decline_friend_request(friend_id)
    if recieved_friend_request?(friend_id)
      self.remove_request(friend_id, :recieved)
      self.save
    end
  end

  def handle_delete_user
    posts.update_all(user_id: nil)

    profile&.destroy
    settings&.destroy
    preferences&.destroy
    memberships.each(&:destroy)

    destroy
  end

  private
    def create_blank_profile
      build_profile(
        description: "",
        address: Address.new(country: "", state: "", city: "")
      ).save
    end


    def valid_birthday
      if birthday.present?
        if birthday > Date.current
          errors.add(:birthday, "Can't be in the future")
        elsif birthday < 150.years.ago
          errors.add(:birthday, "Congratulations on being alive I guess...?")
        elsif birthday > 13.years.ago
          errors.add(:birthday, "You must be at least 13 years old to sign up")
        end
      end
    end


    def create_default_settings
      build_settings.save
    end

    def create_default_preferences
      build_preferences.save
    end
end
