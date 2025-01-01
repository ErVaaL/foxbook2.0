class Event
  include Mongoid::Document
  include Mongoid::Timestamps
  field :title, type: String
  field :description, type: String
  field :event_date, type: Date

  belongs_to :user
  has_and_belongs_to_many :attendees, class_name: "User", inverse_of: :events

  validates :title, presence: true, length: { minimum: 5, maximum: 50 }
  validates :description, presence: true
  validates :event_date, presence: true
  validate :event_date_must_be_future

  def attend(user)
    attendees << user
    save
  end

  def unattend(user)
    attendees.delete(user)
    save
  end


  private

    def event_date_must_be_future
      if event_date.present? && event_date < Time.now
        errors.add(:event_date, "must be in the future")
      end
    end
end
