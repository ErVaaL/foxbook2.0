class Api::V1::NotificationsController < ApplicationController
  before_action :authorize_request
  before_action :set_service

  def index
    result = @service.get_notifications
    render json: result.except(:status), status: result[:status]
  end

  def switch_read_status
    result = @service.switch_was_seen(params[:id])
    render json: result.except(:status), status: result[:status]
  end

  private

    def set_service
      @service = initialize_service(NotificationsServices::NotificationsService)
    end
end
