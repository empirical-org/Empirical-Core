# frozen_string_literal: true

module OrttoIntegration
  class WebhooksController < ApplicationController
    protect_from_forgery except: :create
    before_action :authenticate

    class OrttoWebhookBadRequestException < StandardError; end

    def create
      email = params[:email]
      user = User.find_by_email(email)

      if email.nil? || user.nil?
        ErrorNotifier.report(
          OrttoWebhookBadRequestException.new("Bad request with params: #{params}")
        )
        return head :accepted
      end

      user.update!(send_newsletter: false)
      head :ok
    end

    def authenticate
      return head :forbidden unless params['secret'] == ENV['ORTTO_WEBHOOK_PASSWORD']
    end

  end
end
