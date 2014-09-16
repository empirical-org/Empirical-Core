CarrierWave.configure do |config|
  config.cache_dir = "#{Rails.root}/tmp/"
  config.storage = :fog
  config.permissions = 0666

  config.fog_credentials = {
    provider:              'AWS',
    aws_access_key_id:     ENV['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
  }

  config.fog_directory = ENV['FOG_DIRECTORY']
  config.asset_host = ENV.fetch('ASSET_HOST', "http://s3.amazonaws.com/#{ENV['S3_BUCKET']}")
end
