# frozen_string_literal: true

module GoogleIntegration
  class RefreshTokenValidator < ::ApplicationService
    class ClientFetchAccessTokenError < ::StandardError; end

    MINIMUM_ACCESS_SCOPE = ['openid'].freeze

    attr_reader :auth_credential

    delegate :refresh_token, to: :auth_credential

    def initialize(auth_credential)
      @auth_credential = auth_credential
    end

    def run
      client.fetch_access_token!
    rescue ::Signet::AuthorizationError => e
      auth_credential.destroy!
      raise ClientFetchAccessTokenError, e
    end

    private def client
      SignetClientFetcher.run(refresh_token, scope: MINIMUM_ACCESS_SCOPE)
    end
  end
end
