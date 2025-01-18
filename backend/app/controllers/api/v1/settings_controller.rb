class Api::V1::SettingsController < ApplicationController
  before_action :authorize_request
  before_action :set_service
  before_action :set_user

  def show
    result = @service.show_settings(@user)
    render json: result.except(:status), status: result[:status]
  end

  def update
    settings_params = needed_params(:settings, [ :theme, :language, :notifications, :privacy ])
    result = @service.update(@current_user, settings_params)
    render json: result.except(:status), status: result[:status]
  end

  private

    def set_service
      @service = initialize_service(SettingServices::SettingsService)
    end
end
