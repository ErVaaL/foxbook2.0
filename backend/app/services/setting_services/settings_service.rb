module SettingServices
  class SettingsService < BaseSettingsService
    def show_settings(user)
      return { success: false, error: "You are not authorized to view other user's settings" } if user != @current_user
      { success: true, settings: SettingsSerializer.new(Settings.find_by(user_id: user.id)).serializable_hash }
    rescue Mongoid::Errors::DocumentNotFound
      { success: false, error: "This should not be possible" }
    end

    def update(user, preferences_params)
      return { success: false, error: "You are not authorized to change other user's settings" } if user != @current_user
      return { success: false, error: "Failed to update settings", details: user.settings.errors.full_messages } if !user.settings.update(preferences_params)
      { success: true, settings: SettingsSerializer.new(user.settings).serializable_hash }
    end
  end
end
