Fog.mock!
Fog.credentials = {
  provider:              'AWS',
  aws_access_key_id:     ENV.fetch('AWS_ACCESS_KEY_ID', ''),
  aws_secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY', ''),
}

# Ridiculous hack to get Fog.mock! to cache this fake connection
carrierwave_fog = CarrierWave::Storage::Fog.new(CsvUploader.new)
connection = carrierwave_fog.connection

# connection = Fog::Storage.new(:provider => 'AWS')
connection.directories.create(:key => ENV.fetch('FOG_DIRECTORY'))
connection.directories.create(:key => ENV.fetch('PROGRESS_REPORT_FOG_DIRECTORY'))