CarrierWave.configure do |config|
  config.cache_dir = "#{Rails.root}/tmp/"
  config.storage = :fog
  config.permissions = 0666

  config.fog_credentials = {
    provider:              'AWS',
    aws_access_key_id:     ENV.fetch('AWS_ACCESS_KEY_ID', ''),
    aws_secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY', ''),
  }

  config.fog_directory = ENV.fetch('FOG_DIRECTORY', 'empirical-dev')
  config.asset_host = ENV.fetch('ASSET_HOST', "http://s3.amazonaws.com/#{config.fog_directory}")
end
