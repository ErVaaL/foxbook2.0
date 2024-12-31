class Post
  include Mongoid::Document
  include Mongoid::Timestamps
  field :title, type: String
  field :contents, type: String
  field :likes_count, type: Integer, default: 0
  field :comments_count, type: Integer, default: 0

  has_many :comments, dependent: :destroy

  has_and_belongs_to_many :likes, class_name: "User", inverse_of: nil

  belongs_to :user

  validates :title, presence: true, length: { minimum: 5, maximum: 100 }
  validates :contents, presence: true, length: { minimum: 10, maximum: 1000 }

  def liked_by?(user_id)
    like_ids.include?(user_id)
  end

  def like!(user)
    likes << user unless liked_by?(user.id)
    increment(:likes_count, 1)
    save
  end

  def unlike!(user)
    likes.delete(user) if liked_by?(user.id)
    increment(:likes_count, -1)
    save
  end

  private

    def increment(field, value)
      self[field] += value
    end
end
