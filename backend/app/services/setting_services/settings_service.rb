module SettingServices
  class SettingsService < BaseSettingsService
    def show_settings(user)
      return not_the_same_user_error if user != @current_user
      { success: true, settings: SettingsSerializer.new(Settings.find_by(user_id: user.id)).serializable_hash, status: :ok }
    rescue Mongoid::Errors::DocumentNotFound
      { success: false, error: "This should not be possible", status: :failed_dependency }
    end

    def update(user, settings_params)
      return not_the_same_user_error if user != @current_user
      return { success: false, error: "Failed to update settings", details: user.settings.errors.full_messages, status: :bad_request } if !user.settings.update(settings_params)
      { success: true, settings: SettingsSerializer.new(user.settings).serializable_hash, status: :accepted }
    end
  end
end
