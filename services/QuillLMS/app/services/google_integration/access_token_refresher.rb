# frozen_string_literal: true

module GoogleIntegration
  class AccessTokenRefresher < ::ApplicationService
    attr_reader :auth_credential, :authorization_client

    def initialize(auth_credential, authorization_client)
      @auth_credential = auth_credential
      @authorization_client = authorization_client
    end

    def run
      refresh_access_token
      update_auth_credential
    end

    private def refresh_access_token
      authorization_client.refresh!
    end

    private def update_auth_credential
      auth_credential.update(
        access_token: authorization_client.access_token,
        expires_at: authorization_client.expires_at,
        refresh_token: authorization_client.refresh_token
      )
    end
  end
end
