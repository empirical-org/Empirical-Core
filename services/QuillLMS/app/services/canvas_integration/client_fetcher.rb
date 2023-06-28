# frozen_string_literal: true

module CanvasIntegration
  class ClientFetcher < ApplicationService
    class NilCanvasAuthCredentialError < ::StandardError; end
    class NilCanvasInstanceError < ::StandardError; end

    attr_reader :user

    def initialize(user)
      @user = user
    end

    def run
      raise NilCanvasAuthCredentialError if canvas_auth_credential.nil?
      raise NilCanvasInstanceError if canvas_instance.nil?

      RestClient.new(canvas_auth_credential, canvas_instance)
    end

    private def canvas_auth_credential
      canvas_auth_credential ||= CanvasAuthCredential.find_by(user: user)
    end

    private def canvas_instance
      @canvas_instance ||= canvas_auth_credential.canvas_instance
    end
  end
end
