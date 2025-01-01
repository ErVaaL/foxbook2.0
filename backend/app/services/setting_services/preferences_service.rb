module SettingServices
  class PreferencesService < BaseSettingsService
    def show_preferences(user)
      return not_the_same_user_error if user != @current_user
      { success: true, preferences: PreferencesSerializer.new(Preferences.find_by(user_id: user.id)).serializable_hash, status: :ok }
    rescue Mongoid::Errors::DocumentNotFound
      { success: false, error: "This should not be possible", status: :failed_dependency }
    end

    def update_preferences(user, preferences_params)
      return not_the_same_user_error if user != @current_user
      return { success: false, error: "Failed to update settings", details: user.settings.errors.full_messages } if !user.preferences.update(preferences_params)
      { success: true, settings: PreferencesSerializer.new(user.preferences).serializable_hash, status: :accepted }
    end
  end
end
