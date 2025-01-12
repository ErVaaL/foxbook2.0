class NotificationSerializer
  include JSONAPI::Serializer

  attributes :id, :type, :was_seen, :created_at

  attribute :content do |notification|
    case notification.type
    when "friend_request"
      sender = User.find(notification.content["sender_id"])
      {
        sender_id: notification.content["sender_id"],
        sender_name: sender&.username || "No user/Deleted user",
        message: notification.content["message"],
        action_taken: notification.content["action_taken"]
      }
    when "friend_request_accepted"
      {
        message: notification.content["message"]
      }
    when "event_reminder"
      event = Event.find_by(id: notification.content["event_id"])
      {
        event_id: notification.content["event_id"],
        event_title: event&.title || "No event/Deleted event",
        event_date: event&.date || "No date"
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
