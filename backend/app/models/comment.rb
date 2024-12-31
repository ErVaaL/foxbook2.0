class Comment
  include Mongoid::Document
  include Mongoid::Timestamps

  field :content, type: String

  belongs_to :user
  belongs_to :post, counter_cache: :comments_count

  validates :content, presence: true, length: { minimum: 5, maximum: 1000 }
end
