class NotificationSerializer
  include JSONAPI::Serializer

  attributes :type, :was_seen, :created_at

  attribute :content do |notification|
    case notification.type
    when "friend_request"
      {
        sender_id: notification.content["sender_id"],
        sender_name: User.find(notification.content["sender_id"]).username
      }
    when "event_reminder"
      {
        event_id: notification.content["event_id"],
        event_title: Event.find(notification.content["event_id"]).title,
        event_date: Event.find(notification.content["event_id"]).event_date
      }
    when "tagged"
      {
        post_id: notification.content["post_id"],
        comment_id: notification.content["comment_id"]
      }
    else
      notification.content
    end
  end
end
