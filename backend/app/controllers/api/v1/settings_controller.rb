class Api::V1::SettingsController < ApplicationController
  before_action :authorize_request
  before_action :set_service
  before_action :set_user

  def show
    result = @service.show_settings(@user)
    render json: result, status: result[:success] ? :ok : :not_found
  end

  def update
    preferences_paramsams = needed_params(:settings, [ :theme, :language, :notifications, :privacy ])
    result = @service.update(preferences_params)
    render json: result, status: result[:success] ? :ok : :bad_request
  end

  private

    def set_service
      @service = initialize_service(SettingServices::SettingsService)
    end
end
