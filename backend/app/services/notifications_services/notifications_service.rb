class NotificationsServices::NotificationsService < ApplicationService
  def get_notifications
    notifications = Notification.where(user_id: @current_user.id).desc(:created_at)
    { success: true, notifications: NotificationSerializer.new(notifications).serializable_hash, status: :ok }
  rescue StandardError => e
    { success: false, error: e.message, status: :internal_server_error }
  end

  def mark_as_seen(notification_id)
    notification = Notification.find(notification_id)
    return { success: false, error: "Not authorized to interact with this notification", status: :unauthorized } unless notification.user_id == @current_user.id
    notification.switch_was_seen
    { success: true, message: "Notification marked as seen", status: :ok }
  rescue Mongoid::Errors::DocumentNotFound
    { success: false, error: "Notification not found", status: :not_found }
  rescue StandardError => e
    { success: false, error: e.message, status: :internal_server_error }
  end

  def create_notification(user_id:, type:, content:)
    notification = Notification.new(user_id: user_id, type: type, content: content)
    { success: false, error: notification.errors.full_messages, status: :bad_request } unless notification.save
    { success: true, message: NotificationSerializer.new(notification).serializable_hash, status: :created }
  rescue StandardError => e
    { success: false, error: e.message, status: :internal_server_error }
  end
end
