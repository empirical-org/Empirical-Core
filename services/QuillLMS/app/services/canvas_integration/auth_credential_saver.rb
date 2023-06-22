# frozen_string_literal: true

module CanvasIntegration
  class AuthCredentialSaver < ApplicationService
    class CanvasInstanceNotFoundError < StandardError; end
    class CanvasAccountNotFoundError < StandardError; end

    attr_reader :credentials, :external_id, :info

    def initialize(auth_hash)
      @credentials = auth_hash[:credentials]
      @external_id = auth_hash[:uid]
      @info = auth_hash[:info]
    end

    def run
      raise CanvasInstanceNotFoundError unless canvas_instance
      raise CanvasAccountNotFoundError unless canvas_account

      create_canvas_instance_auth_credential
      auth_credential
    end

    private def access_token
      credentials[:token]
    end

    private def auth_credential
      @auth_credential ||=
        CanvasAuthCredential.create!(
          access_token: access_token,
          expires_at: expires_at,
          provider: CanvasAuthCredential::PROVIDER,
          refresh_token: refresh_token,
          user: user
        )
    end

    private def canvas_account
      @canvas_account ||= CanvasAccount.find_by(external_id: external_id, canvas_instance: canvas_instance)
    end

    private def create_canvas_instance_auth_credential
      auth_credential.create_canvas_instance_auth_credential!(canvas_instance: canvas_instance)
    end

    private def canvas_instance
      @canvas_instance ||= CanvasInstance.find_by(url: info[:url])
    end

    private def expires_at
      Time.zone.at(credentials[:expires_at]).to_datetime
    end

    private def refresh_token
      credentials[:refresh_token]
    end

    private def user
      canvas_account.user
    end
  end
end
