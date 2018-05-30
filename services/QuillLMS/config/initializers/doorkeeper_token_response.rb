class Doorkeeper::OAuth::TokenResponse
  def body
    {
      'access_token'  => token.token,
      'token_type'    => token.token_type,
      'expires_in'    => token.expires_in_seconds,
      'refresh_token' => token.refresh_token,
      'scope'         => token.scopes_string,
      'user_info'     => User.find(token.resource_owner_id).as_json(only: [], methods: [:role, :name])
    }.reject { |_, value| value.blank? }
  end
end
