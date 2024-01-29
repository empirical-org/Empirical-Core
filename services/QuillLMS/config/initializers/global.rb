# frozen_string_literal: true

Global.configure do |config|
  config.backend          = :filesystem
  config.environment      = Rails.env.to_s
  config.config_directory = Rails.root.join('config/global').to_s
end
