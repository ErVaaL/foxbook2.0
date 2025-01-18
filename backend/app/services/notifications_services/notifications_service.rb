class NotificationsServices::NotificationsService < ApplicationService
  def get_notifications
    notifications = Notification.where(user_id: @current_user.id).desc(:created_at)
    { success: true, notifications: NotificationSerializer.new(notifications).serializable_hash, status: :ok }
  rescue StandardError => e
    { success: false, error: e.message, status: :internal_server_error }
  end

  def switch_was_seen(notification_id)
    notification = Notification.find(notification_id)
    return { success: false, error: "Not authorized to interact with this notification", status: :unauthorized } unless notification.user_id == @current_user.id
    notification.switch_was_seen
    { success: true, notification: NotificationSerializer.new(notification).serializable_hash, status: :ok }
  rescue Mongoid::Errors::DocumentNotFound
    { success: false, error: "Notification not found", status: :not_found }
  rescue StandardError => e
    { success: false, error: e.message, status: :internal_server_error }
  end

  def create_notification(user_id:, type:, content:)
    notification = Notification.new(user_id: user_id, type: type, content: content)

    if notification.save!
      notification.reload

      serialized_notification = NotificationSerializer.new(notification).serializable_hash
      formatted_notification = {
        id: serialized_notification[:data][:id],  # Ensure single `id`
        type: serialized_notification[:data][:type],
        attributes: serialized_notification[:data][:attributes]
      }

      NotificationChannel.broadcast_to(User.find(user_id), formatted_notification)

      { success: true, message: serialized_notification, status: :created }
    else
      { success: false, error: notification.errors.full_messages, status: :bad_request }
    end
  end
end
