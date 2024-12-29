class Api::V1::SettingsController < ApplicationController
  before_action :authorize_request

  def show
    render json: SettingsSerializer.new(@current_user.settings).serializable_hash, status: :ok
  end

  def update
    settings_params = needed_params(:settings, [ :theme, :language, :notifications, :privacy ])
    if @current_user.settings.update(settings_params)
      render json: SettingsSerializer.new(@current_user.settings).serializable_hash, status: :accepted
    else
      render json: { error: "Failed to update settings", details: @current_user.settings.errors.full_messages }, status: :bad_request
    end
  end
end
