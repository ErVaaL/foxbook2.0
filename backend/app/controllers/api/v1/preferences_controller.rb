class Api::V1::PreferencesController < ApplicationController
  before_action :authorize_request
  before_action :set_user
  before_action :set_service

  def show
    result = @service.show_preferences(@user)
    render json: result.except(:status), status: result[:status] || :ok
  end

  def update
    preferences_params = needed_params(:preferences, [ :friend_recommendations, :group_recommendations, :stranger_invites ])
    result = @service.update_preferences(@user, preferences_params)
    render json: result.except(:status), status: result[:status] || :accepted
  end

  private

    def set_service
      @service = initialize_service(SettingServices::PreferencesService)
    end
end
