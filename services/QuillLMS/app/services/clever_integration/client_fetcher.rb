# frozen_string_literal: true

module CleverIntegration
  class ClientFetcher < ApplicationService
    attr_reader :user

    class UnsupportedAuthCredentialError < StandardError; end
    class NilAuthCredentialError < StandardError; end

    ERRORS = [
      ClientFetcher::NilAuthCredentialError,
      ClientFetcher::UnsupportedAuthCredentialError
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

      case auth_credential
      when CleverDistrictAuthCredential then district_client
      when CleverLibraryAuthCredential then library_client
      else raise UnsupportedAuthCredentialError, auth_credential
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
