require 'google/api_client'

module GoogleIntegration::Client

  def self.create(access_token)
    client = Google::APIClient.new(application_name: 'quill')
    client.authorization.access_token = access_token
    client
  end

end