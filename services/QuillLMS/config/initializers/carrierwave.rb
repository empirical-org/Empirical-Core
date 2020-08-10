require 'carrierwave/storage/abstract'
require 'carrierwave/storage/file'
require 'carrierwave/storage/fog'

CarrierWave.configure do |config|
  config.cache_dir = "#{Rails.root}/tmp/images"
  config.permissions = 0o666

  config.storage = :fog
  config.fog_provider 'fog/aws'

  config.fog_credentials = {
    provider:              'AWS',
    aws_access_key_id:     ENV.fetch('AWS_UPLOADS_ACCESS_KEY_ID', ''),
    aws_secret_access_key: ENV.fetch('AWS_UPLOADS_SECRET_ACCESS_KEY', ''),
  }

  config.fog_directory = ENV.fetch('FOG_UPLOADS_DIRECTORY', 'quill-image-uploads')
  config.asset_host = ENV.fetch('ASSET_HOST', "https://s3.amazonaws.com/#{config.fog_directory}")
end
