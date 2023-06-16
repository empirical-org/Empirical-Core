# frozen_string_literal: true

module CanvasIntegration
  class UserFinder < ApplicationService
    class CanvasInstanceNotFoundError < StandardError; end
    class CanvasAccountNotFoundError < StandardError; end

    attr_reader :auth_hash

    def initialize(auth_hash)
      @auth_hash = auth_hash
    end

    def run
      raise CanvasInstanceNotFoundError unless canvas_instance
      raise CanvasAccountNotFoundError unless canvas_account

      canvas_account.user
    end

    private def canvas_account
      @canvas_account ||= CanvasAccount.find_by(external_id: external_id, canvas_instance: canvas_instance)
    end

    private def canvas_instance
      @canvas_instance ||= CanvasInstance.find_by(url: url)
    end

    private def external_id
      auth_hash[:uid]
    end

    private def info
      auth_hash[:info]
    end

    private def url
      info[:url]
    end
  end
end
