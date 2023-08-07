# frozen_string_literal: true

module GoogleIntegration
  class ClientFetcher < ApplicationService
    class NilAuthCredentialError < StandardError; end
    class NonGoogleAuthCredentialError < StandardError; end
    class GoogleUnauthorizedError < StandardError; end

    attr_reader :user

    delegate :auth_credential, to: :user

    def initialize(user)
      @user = user
    end

    def run
      validate_auth_credential
      fetch_client
    end

    private def fetch_client
      RestClient.new(auth_credential)
    end

    private def validate_auth_credential
      raise NilAuthCredentialError unless auth_credential
      raise NonGoogleAuthCredentialError unless auth_credential.is_a?(GoogleAuthCredential)
      raise GoogleUnauthorizedError unless auth_credential.google_authorized?
    end
  end
end
