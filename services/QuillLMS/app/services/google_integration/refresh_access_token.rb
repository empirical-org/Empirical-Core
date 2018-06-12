class GoogleIntegration::RefreshAccessToken

  TOKEN_ENDPOINT = 'https://accounts.google.com/o/oauth2/token'

  def initialize(user, http_client = nil)
    @user = user
    @http_client = http_client || HTTParty
  end

  def refresh
    if should_refresh?
      handle_response { make_request }
    else
      current_credentials
    end
  end

  private

  def make_request
    @http_client.post(TOKEN_ENDPOINT, refresh_token_options)
  end

  def handle_response(&request)
    response = request.call

    if response.code == 200
      store_credentials(response)
    else
      false
    end
  end

  def store_credentials(response)
    data = response.parsed_response

    attributes = Hash.new.tap do |hash|
      hash[:access_token] = data['access_token'] if data['access_token'].present?
      hash[:expires_at]   = data['expires_in']   if data['expires_in'].present?
      hash[:timestamp]    = data['issued_at']    if data['issued_at'].present?
    end

    if current_credentials.update(attributes)
      current_credentials.reload
    else
      false
    end
  end

  def refresh_token
    current_credentials.refresh_token
  end

  def current_credentials
    @user.auth_credential
  end

  def should_refresh?
    current_credentials.expires_at.nil? ||
    Time.now > current_credentials.expires_at
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
