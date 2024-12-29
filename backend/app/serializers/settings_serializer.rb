class SettingsSerializer
  include JSONAPI::Serializer
  attributes :theme, :language, :notifications, :privacy
end
