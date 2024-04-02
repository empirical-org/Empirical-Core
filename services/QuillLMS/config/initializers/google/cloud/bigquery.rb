# frozen_string_literal: true

require "google/cloud/bigquery"

Google::Cloud::Bigquery.configure do |config|
  config.credentials = JSON.parse(ENV.fetch('BIGQUERY_CREDENTIALS', '{}'))
end
