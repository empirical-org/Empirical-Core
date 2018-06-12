require 'google/api_client'

class GoogleIntegration::Client

  def initialize(access_token, api_client = nil, token_refresher = nil)
    @access_token    = access_token
    @api_client      = api_client || Google::APIClient
    @token_refresher = token_refresher || GoogleIntegration::RefreshAccessToken
  end

  def create
    client.authorization.access_token = verified_token
    client
  end

  private

  def verified_token
    @verified_token ||= @token_refresher.new(@access_token).refresh
  end

  def client
    @client ||= @api_client.new(application_name: 'quill')
  end
end
