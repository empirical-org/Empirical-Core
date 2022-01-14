# frozen_string_literal: true

module CleverIntegration
  class ClientFetcher < ApplicationService
    attr_reader :user

    class UnsupportedProviderError < StandardError; end
    class NilAuthCredentialError < StandardError; end

    ERRORS = [
      ClientFetcher::NilAuthCredentialError,
      ClientFetcher::UnsupportedProviderError
    ].freeze

    def initialize(user)
      @user = user
    end

    def run
      client
    end

    private def access_token
      auth_credential.access_token
    end

    private def auth_credential
      user.auth_credential
    end

    private def client
      raise NilAuthCredentialError if auth_credential.nil?

      case provider
      when AuthCredential::CLEVER_DISTRICT_PROVIDER then district_client
      when AuthCredential::CLEVER_LIBRARY_PROVIDER then library_client
      else raise UnsupportedProviderError, provider
      end
    end

    private def district_client
      DistrictClient.new(access_token)
    end

    private def library_client
      LibraryClient.new(access_token)
    end

    private def provider
      auth_credential.provider
    end
  end
end
