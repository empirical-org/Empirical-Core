class GoogleIntegration::RefreshAccessToken
  # https://stackoverflow.com/questions/12792326/how-do-i-refresh-my-google-oauth2-access-token-using-my-refresh-token#14491560
  # TODO: this can be made much better with the psuedo-code block commented out below
  # if !current_user.refresh_token
  #       then we will need to tell the js to re-auth them via #google, where they will need to manually sign in.
  # elsif current_user.google_token_expires_at < DateTime.now
  #      then we need to use refresh token as shown below
  # end

  def initialize(user)
    @user = user
  end

  def refresh
    @response = HTTParty.post('https://accounts.google.com/o/oauth2/token', refresh_token_options)
    if @response.code == 200
      access_token = @response.parsed_response['access_token']
      @user.auth_credential.update(access_token: access_token)
    else
      false
    end
  end

  private

  def refresh_token
    @user.auth_credential.refresh_token
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
