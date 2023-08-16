# frozen_string_literal: true

module GoogleIntegration
  class AccessTokenRefresher < ::ApplicationService
    class ClientRefreshError < ::StandardError; end

    attr_reader :auth_credential

    delegate :refresh_token, to: :auth_credential

    def initialize(auth_credential)
      @auth_credential = auth_credential
    end

    def run
      refresh_client
      update_auth_credential
    end

    private def client
      @client ||= SignetClientFetcher.run(refresh_token)
    end

    private def refresh_client
      client.refresh!
    rescue ::Signet::AuthorizationError => e
      auth_credential.destroy!
      raise ClientRefreshError, e
    end

    private def update_auth_credential
      auth_credential.update!(
        access_token: client.access_token,
        expires_at: client.expires_at,
        refresh_token: client.refresh_token
      )
    end
  end
end
