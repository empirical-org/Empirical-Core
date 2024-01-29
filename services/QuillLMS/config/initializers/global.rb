# frozen_string_literal: true

Global.configure do |config|
  config.backend :filesystem, environment: Rails.env.to_s, path: Rails.root.join('config/global').to_s
  config.environment      = Rails.env.to_s
  config.config_directory = Rails.root.join('config/global').to_s
end
