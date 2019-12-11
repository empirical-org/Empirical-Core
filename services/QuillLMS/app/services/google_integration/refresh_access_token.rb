class GoogleIntegration::RefreshAccessToken

  class RefreshAccessTokenError < StandardError; end

  class NoRefreshTokenError < RefreshAccessTokenError
    def message
      "No existing Google Refresh Token available to submit"
    end
  end

  class TokenTooOldToRefreshError < RefreshAccessTokenError
    def message
      "Existing Google Access Token is too old to refresh"
    end
  end

  class FailedToRefreshTokenError < RefreshAccessTokenError; end

  class FailedToSaveRefreshedTokenError < RefreshAccessTokenError; end

  TOKEN_ENDPOINT = 'https://accounts.google.com/o/oauth2/token'

  def initialize(user, http_client = nil)
    @user        = user
    @http_client = http_client || HTTParty
  end

  def refresh
    if should_refresh?
      raise NoRefreshTokenError if !current_credentials&.refresh_token
      # According to Google documentation, refresh tokens older than
      # 6 months can not be refreshed:
      # https://developers.google.com/identity/protocols/OAuth2#expiration
      raise TokenTooOldToRefreshError if token_too_old_to_refresh?
      handle_response(make_request)
    else
      current_credentials
    end
  end

  private

  def make_request
    @http_client.post(TOKEN_ENDPOINT, refresh_token_options)
  end

  def handle_response(response)
    if response.code == 200
      store_credentials(response)
    else
      msg = "Non-200 response when attempting to refresh access token: '#{response&.parsed_response["error"]}'"
      raise FailedToRefreshTokenError.new(msg)
    end
  end

  def store_credentials(response)
    data       = response.parsed_response
    attributes = parse_attributes(data)

    if current_credentials.update(attributes)
      current_credentials.reload
    else
      msg = "Failed to save updated access token: '#{current_credentials.errors.messages}'"
      raise FailedToSaveRefreshedTokenError.new(msg)
    end
  end

  def parse_attributes(data)
    {}.tap do |attributes|
      if data['access_token'].present?
        attributes[:access_token] = data['access_token']
      end

      if data['expires_in'].present?
        attributes[:expires_at] = data['expires_in']
      end

      if data['issued_at'].present?
        attributes[:timestamp] = data['issued_at']
      end
    end
  end

  def refresh_token
    current_credentials.refresh_token
  end

  def current_credentials
    @current_credentials ||= @user.auth_credential
  end

  def should_refresh?
    current_credentials && (current_credentials.expires_at.nil? ||
      Time.now > current_credentials.expires_at
    )
  end

  def token_too_old_to_refresh?
    Time.now - 6.months >= current_credentials.expires_at
  end

  def refresh_token_options
    {
      body: {
        client_id: ENV["GOOGLE_CLIENT_ID"],
        client_secret: ENV["GOOGLE_CLIENT_SECRET"],
        refresh_token: refresh_token,
        grant_type: 'refresh_token'
      },
      headers: {
        'Content-Type' => 'application/x-www-form-urlencoded'
      }
    }
  end
end
