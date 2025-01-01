module SettingServices
  class BaseSettingsService < ApplicationService
    def initialize(current_user:)
      @current_user = current_user
    end
  end
end
