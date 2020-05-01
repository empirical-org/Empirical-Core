class RefreshGoogleRefreshTokensWorker
  include Sidekiq::Worker

  GOOGLE_API_CLIENT_ACCESS_TOKEN = ENV['GOOGLE_API_CLIENT_ACCESS_TOKEN']
  GOOGLE_API_CLIENT_REFRESH_TOKEN = ENV['GOOGLE_API_CLIENT_REFRESH_TOKEN']
  OAUTH_SCOPE = 'https://www.googleapis.com/auth/drive'
  REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob'

  def perform
	  User.where.not(google_id: [nil, ""]).each do |user|
	    verified_credentials = GoogleIntegration::Client.new(user)
	    client = verified_credentials.send(:client)
	    client_secrets = Google::APIClient::ClientSecrets.load
	    client.authorization.client_id     = client_secrets.client_id
	    client.authorization.client_secret = client_secrets.client_secret
	    client.authorization.scope         = OAUTH_SCOPE
	    client.authorization.redirect_uri  = REDIRECT_URI

	    auth = {"access_token"=>
	            GOOGLE_API_CLIENT_ACCESS_TOKEN,
	            "token_type"=>"Bearer",
	            "expires_in"=>3600,
	            "refresh_token"=>GOOGLE_API_CLIENT_REFRESH_TOKEN}
	    client.authorization.code = nil
	    client.authorization.issued_at = Time.now
	    client.authorization.update_token!(auth)
	    drive = client.discovered_api('drive', 'v2')
	    res = client.execute(api_method: drive.children.list, parameters: {'folderId' => '0B2HguQEg6QQ1TnFCbUZ4UWZqVk0','maxResults' => 1000})
	  end
  end
end
