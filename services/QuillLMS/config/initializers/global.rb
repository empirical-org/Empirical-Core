Global.configure do |config|
  config.environment      = Rails.env.to_s
  config.config_directory = Rails.root.join('config/global').to_s
end
