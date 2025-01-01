module SettingServices
  class BaseSettingsService
    def initialize(current_user:)
      @current_user = current_user
    end
  end
end
