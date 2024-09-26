# frozen_string_literal: true

require 'google/cloud/storage'

# GOOGLE_CLOUD_STORAGE_CSV_BUCKET = ENV.fetch('GOOGLE_CLOUD_STORAGE_CSV_BUCKET')

Google::Cloud::Storage.configure do |config|
  config.credentials = JSON.parse(ENV.fetch('GOOGLE_CLOUD_STORAGE_CREDENTIALS', '{}'))
end
