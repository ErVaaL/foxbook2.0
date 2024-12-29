class Api::V1::PreferencesController < ApplicationController
  before_action :authorize_request
  before_action :set_user

  def show
    preferences = @user.preferences

    if preferences
      render json: PreferenceSerializer.new(preferences).serializable_hash, status: :ok
    else
      render json: { error: "Preferences not found" }, status: :not_found
    end
  end

  def update
    preferences_params = needed_params(:preferences, [ :friend_recommendations, :group_recommendations, :stranger_invites ])
    preferences = @user.preferences
    if preferences.update(preferences_params)
      render json: PreferenceSerializer.new(preferences).serializable_hash, status: :accepted
    else
      render json: { error: "Failed to update preferences", details: preferences.errors.full_messages }, status: :bad_request
    end
  end
end
