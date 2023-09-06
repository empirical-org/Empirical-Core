# frozen_string_literal: true

require "google/cloud/ai_platform"

Google::Cloud::AIPlatform.configure do |config|
  config.credentials = "/Users/bs/blah.json"
  # config.credentials = JSON.parse(ENV.fetch('AI_PLATFORM_CREDENTIALS', '{}'))
end

require "logger"

module MyLogger
  def logger
    Rails.logger
  end
end

# Define a gRPC module-level logger method before grpc/logconfig.rb loads.
module GRPC
  extend MyLogger
end

curl -X GET \
    -H "Authorization: Bearer $(gcloud auth print-access-token)" \
    "https://us-central1-aiplatform.googleapis.com/v1/projects/comprehension-247816/locations/us-central1/datasets"


# begin
#   client = Google::Cloud::AIPlatform.dataset_service
#   location= "us-central1"
#   project_id = 'comprehension-247816'
#   parent = client.location_path(project: project_id, location: location)
#   response = client.list_datasets(parent: parent)
#   puts "Permissions are correctly set up; could successfully list datasets."
# rescue Google::Cloud::PermissionDeniedError => e
#   puts "Permission denied: #{e}"
# rescue StandardError => e
#   puts "Error: #{e.message}"
#   puts e.backtrace.inspect
# end

# credentials_path = '/Users/bs/blah2.json'

# credentials = Google::Auth::ServiceAccountCredentials.make_creds(
#   json_key_io: File.open(credentials_path),
#   scope: 'https://www.googleapis.com/auth/cloud-platform'
# )

# credentials.fetch_access_token!
# jwt_token = credentials.access_token

# credentials_json = File.read(credentials_path)

# # Parse the JSON
# credentials = JSON.parse(credentials_json)

# # Extract the private_key
# secret = credentials["private_key"]

# begin
#   decoded_token = JWT.decode(
#     jwt_token,
#     secret,
#     true,  # Enable signature verification
#     { algorithm: 'HS256', aud: 'https://aiplatform.googleapis.com/google.cloud.aiplatform.v1.DatasetService', verify_aud: true }
#   )
#   puts "Successfully decoded with matching audience."
# rescue JWT::InvalidAudError
#   puts "Invalid audience."
# rescue JWT::DecodeError => e
#   puts "Invalid token: #{e.message}"
# end


# begin
#   decoded_token = JWT.decode jwt_token, secret, true, { algorithm: 'HS256' }
#   puts decoded_token
# rescue JWT::DecodeError => e
#   puts "Invalid token: #{e.message}"
# end

# require 'base64'

# def urlsafe_base64_decode(str)
#   str += '=' * (4 - str.length.modulo(4))
#   Base64.decode64(str.tr('-_', '+/'))
# end

# header, payload, signature = jwt_token.split('.')

# begin
#   puts "Header: #{JSON.parse(urlsafe_base64_decode(header))}"
#   puts "Payload: #{JSON.parse(urlsafe_base64_decode(payload))}"
# rescue => e
#   puts "Error decoding segment: #{e.message}"
# end