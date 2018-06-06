class GoogleIntegration::AuthCredentials

  def initialize(request, user)
    @request = request
    @user = user
  end

  def create_or_update
    params = {}
    params[:refresh_token] = refresh_token if refresh_token.present?
    params[:access_token]  = access_token  if access_token.present?

    credentials.update(params)
  end

  def credentials
    @credentials ||= ::AuthCredential.find_or_initialize_by(
      user_id: @user.id,
      provider: 'google'
    )
  end

  def access_token
    @access_token ||= @request.env['omniauth.auth']['credentials']['token']
  end

  def refresh_token
    @refresh_token ||= begin
      @request.env['omniauth.auth']['credentials']['refresh_token']
    end
  end

  private

  def token_expiration
    date = request.env['omniauth.auth']['credentials']['expires_at'].to_s
    DateTime.strptime(date, '%s')
  end
end
