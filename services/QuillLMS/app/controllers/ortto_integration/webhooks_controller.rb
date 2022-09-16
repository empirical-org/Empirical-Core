# frozen_string_literal: true

module OrttoIntegration
  class WebhooksController < ApplicationController
    protect_from_forgery except: :create
    http_basic_authenticate_with name: 'ortto_webhook_user', password: ENV['ORTTO_WEBHOOK_PASSWORD']

    before_action :valid_params?, only: [:create]

    class OrttoWebhookBadRequestException < StandardError; end

    def create
      puts "\n\n --- PARAMS: #{params.inspect}"
      unless valid_params?
        ErrorNotifier.report(
          OrttoWebhookBadRequestException.new("Bad request with params: #{params}")
        )
        return head(:bad_request)
      end

      email = params.dig(:activity, :contact, :email)
      user = User.find_by_email(email)
      return head :accepted unless user

      user.update!(send_newsletter: false)
      head :ok
    end

    private def valid_params?
      return false unless params.dig(:activity, :contact, :email)
      true
    end

  end
end
