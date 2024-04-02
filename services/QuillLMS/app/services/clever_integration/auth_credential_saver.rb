# frozen_string_literal: true

module CleverIntegration
  class AuthCredentialSaver < ApplicationService
    attr_reader :access_token, :auth_credential_class, :user

    def initialize(access_token:, auth_credential_class:, user:)
      @access_token = access_token
      @auth_credential_class = auth_credential_class
      @user = user
    end

    def run
      delete_previous_credential
      assign_new_credential
    end

    private def assign_new_credential
      user.auth_credential = new_auth_credential
    end

    private def delete_previous_credential
      AuthCredential.where(user: user).destroy_all
    end

    private def expires_at
      @expires_at ||= auth_credential_class::EXPIRATION_DURATION.from_now
    end

    private def new_auth_credential
      auth_credential_class.create!(
        access_token: access_token,
        expires_at: expires_at,
        user: user
      )
    end
  end
end
