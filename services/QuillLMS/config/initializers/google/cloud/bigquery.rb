# frozen_string_literal: true

require "google/cloud/bigquery"

Google::Cloud::Bigquery.configure do |config|
  config.project_id  = ENV.fetch('BIGQUERY_PROJECT_ID')
  config.credentials = JSON.parse(ENV.fetch('BIGQUERY_CREDENTIALS', '{}'))
end
