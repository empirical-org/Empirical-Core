# frozen_string_literal: true

module GoogleIntegration
  class AuthorizationClientFetcher < ::ApplicationService
    TOKEN_CREDENTIAL_URI = 'https://oauth2.googleapis.com/token'

    attr_reader :auth_credential

    def initialize(auth_credential)
      @auth_credential = auth_credential
    end

    def run
      refresh_access_token
      client
    end

    private def client
      @client ||=
        Signet::OAuth2::Client.new(
          client_id: Auth::Google::CLIENT_ID,
          client_secret: Auth::Google::CLIENT_SECRET,
          refresh_token: auth_credential.refresh_token,
          token_credential_uri: TOKEN_CREDENTIAL_URI
        )
    end

    private def refresh_access_token
      return unless auth_credential.access_token_expired?

      AccessTokenRefresher.run(auth_credential, client)
    end
  end
end
