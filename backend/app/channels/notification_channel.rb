class NotificationChannel < ApplicationCable::Channel
  def subscribed
    if current_user
      stream_for current_user
    else
      reject
    end
  end

  def unsubscribed
    Rails.logger.info "❌ Unsubscribed: User #{current_user&.id}"
  end
end
