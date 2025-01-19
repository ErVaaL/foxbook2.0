class PostSerializer
  include JSONAPI::Serializer

  attributes :title, :contents, :likes_count, :comments_count, :created_at, :like_ids

  attribute :author do |post|
    {
      id: post.user.id.to_s,
      avatar: post.user.avatar,
      first_name: post.user.first_name,
      last_name: post.user.last_name,
      username: post.user.username
    }
  end
end
