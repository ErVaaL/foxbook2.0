class PostSerializer
  include JSONAPI::Serializer

  attributes :title, :contents, :likes_count, :comments_count

  attribute :author do |post|
    {
      id: post.user.id.to_s,
      username: post.user.username
    }
  end
end
