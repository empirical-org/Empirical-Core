# frozen_string_literal: true

module GoogleIntegration
  class AuthorizationClientFetcher < ::ApplicationService
    attr_reader :auth_credential

    def initialize(auth_credential)
      @auth_credential = auth_credential
    end

    def run
      validate_refresh_token
      refresh_access_token
      fetch_signet_client
    end

    private def fetch_signet_client
      SignetClientFetcher.run(refresh_token)
    end

    private def refresh_access_token
      return unless auth_credential.access_token_expired?

      AccessTokenRefresher.run(auth_credential)
    end

    private def refresh_token
      # reload in case the AccessTokenRefresher updated the refresh_token
      auth_credential.reload.refresh_token
    end

    private def validate_refresh_token
      RefreshTokenValidator.run(auth_credential)
    end
  end
end
