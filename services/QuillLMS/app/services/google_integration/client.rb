require 'google/api_client'

class GoogleIntegration::Client

  def initialize(user, api_client = nil, token_refresher = nil)
    @user            = user
    @api_client      = api_client || Google::APIClient
    @token_refresher = token_refresher || GoogleIntegration::RefreshAccessToken
  end

  def create
    client.authorization.access_token = access_token
    client
  end

  private

  def access_token
    verified_credentials.access_token
  end

  def verified_credentials
    @verified_credentials ||= @token_refresher.new(@user).refresh
  end

  def client
    @client ||= @api_client.new(application_name: 'quill')
  end
end
