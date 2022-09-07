# frozen_string_literal: true

module OrttoIntegration
  class WebhooksController < ApplicationController
    protect_from_forgery except: :create

    def create
    end

  end
end
