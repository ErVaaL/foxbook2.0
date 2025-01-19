class CommentSerializer
  include JSONAPI::Serializer

  attributes :content

  attribute :author do |comment|
    {
      id: comment.user.id.to_s,
      username: comment.user.username,
      avatar: comment.user.avatar
    }
  end
end
