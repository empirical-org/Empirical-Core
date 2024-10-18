# frozen_string_literal: true

require 'google/cloud/storage'

Google::Cloud::Storage.configure do |config|
  config.credentials = JSON.parse(ENV.fetch('GOOGLE_CLOUD_STORAGE_CREDENTIALS', '{}'))
end
