module SettingServices
  class PreferencesService < BaseSettingsService
    def show_preferences(user)
      return { success: false, error: "You are not authorized to view this user's settings" } if user != @current_user
      { success: true, preferences: PreferencesSerializer.new(Preferences.find_by(user_id: user.id)).serializable_hash }
    rescue Mongoid::Errors::DocumentNotFound
      { success: false, error: "This should not be possible" }
    end

    def update_preferences(user, preferences_params)
      return { success: false, error: "You are not authorized to change other user's preferences" } if user != @current_user
      return { success: false, error: "Failed to update settings", details: user.settings.errors.full_messages } if !user.preferences.update(preferences_params)
      { success: true, settings: PreferencesSerializer.new(user.preferences).serializable_hash }
    end
  end
end
