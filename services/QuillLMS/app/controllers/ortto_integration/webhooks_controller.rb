# frozen_string_literal: true

module OrttoIntegration
  class WebhooksController < ApplicationController
    protect_from_forgery except: :create
    before_action :authenticate

    class OrttoWebhookBadRequestException < StandardError; end

    def create
      email = params[:email]

      if email.nil?
        ErrorNotifier.report(
          OrttoWebhookBadRequestException.new("Bad request with params: #{params}")
        )
        return head 202
      end

      user = User.find_by_email(email)

      if user.nil?
        ErrorNotifier.report(
          OrttoWebhookBadRequestException.new("Bad request with params: #{params}")
        )
        return head 202
      end

      user.update!(send_newsletter: false)
      head :ok
    end

    def authenticate
      return head 403 unless params['secret'] == ENV['ORTTO_WEBHOOK_PASSWORD']
    end

  end
end
