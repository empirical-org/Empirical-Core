# frozen_string_literal: true

module CleverIntegration
  class AuthCredentialSaver < ApplicationService
    attr_reader :user, :access_token, :provider

    def initialize(user, access_token, provider)
      @user = user
      @access_token = access_token
      @provider = provider
    end

    def run
      delete_previous_credential
      assign_new_credential
      initiate_expiration_worker
    end

    private def assign_new_credential
      user.auth_credential = new_auth_credential
    end

    private def delete_previous_credential
      user.auth_credential&.destroy
    end

    private def expires_at
      @expires_at ||= AuthCredential::CLEVER_EXPIRATION_DURATION.from_now
    end

    private def initiate_expiration_worker
      PurgeExpiredAuthCredentialWorker.perform_in(expires_at, new_auth_credential.id)
    end

    private def new_auth_credential
      @new_auth_credential ||= AuthCredential.create!(
        access_token: access_token,
        expires_at: expires_at,
        provider: provider,
        user: user
      )
    end
  end
end
