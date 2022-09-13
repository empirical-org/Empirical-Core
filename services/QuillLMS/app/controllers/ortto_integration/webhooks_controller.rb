# frozen_string_literal: true

module OrttoIntegration
  class WebhooksController < ApplicationController
    protect_from_forgery except: :create
    http_basic_authenticate_with name: 'ortto_webhook_user', password: ENV['ORTTO_WEBHOOK_PASSWORD']

    before_action :valid_params?, only: [:create]

    class OrttoWebhookBadRequestException < StandardError; end

    VALID_ACTIONS = [
      SUBSCRIBE   = 'subscribe',
      UNSUBSCRIBE = 'unsubscribe'
    ]

    def create
      unless valid_params?
        ErrorNotifier.report(
          OrttoWebhookBadRequestException.new("Bad request with params: #{params}")
        )
        return head(:bad_request)
      end

      user = User.find_by_email(params[:email])
      return unless user

      user.update!(send_newsletter: params[:action_name] == SUBSCRIBE)
      head :no_content
    end

    private def valid_params?
      puts "\n\n --- PARAMS: #{params.inspect}"
      return false unless params[:email]
      return false unless params[:action_name] && VALID_ACTIONS.include?(params[:action_name])

      true
    end

  end
end
