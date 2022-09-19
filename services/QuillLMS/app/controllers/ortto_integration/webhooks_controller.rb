# frozen_string_literal: true

module OrttoIntegration
  class WebhooksController < ApplicationController
    protect_from_forgery except: :create
    before_action :create, :authenticate
    #http_basic_authenticate_with name: 'ortto_webhook_user', password: ENV['ORTTO_WEBHOOK_PASSWORD']

    class OrttoWebhookBadRequestException < StandardError; end

    def create
      puts "\n\n --- PARAMS: #{params.inspect}"
      puts "\nactivity: #{params.dig(:activity).class} #{params.dig(:activity)}"
      puts "\ncontact: #{params.dig(:activity, :contact).class} #{params.dig(:activity, :contact)}"

      email = params.dig(:activity, :contact, :email)
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

    # private def valid_params?
    #   return false unless params.dig(:activity, :contact, :email)
    #   true
    # end

  end

  def authenticate
    puts "authenticate value: {params['secret'] == ENV['ORTTO_WEBHOOK_PASSWORD']}"
    params['secret'] == ENV['ORTTO_WEBHOOK_PASSWORD']
  end
end
