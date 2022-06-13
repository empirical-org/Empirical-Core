# frozen_string_literal: true

module StripeIntegration
  class WebhooksController < ApplicationController
    protect_from_forgery except: :create

    ENDPOINT_SECRET = ENV.fetch('STRIPE_ENDPOINT_SECRET', '')

    def create
      Webhooks::HandleEventWorker.perform_async(stripe_webhook_event.id)
      head 200
    rescue ActiveRecord::RecordNotUnique
      head 200
    rescue => e
      ErrorNotifier.report(e)
      head 400
    end

    private def event
      @event ||= Stripe::Webhook.construct_event(payload, signature_header, ENDPOINT_SECRET)
    end

    private def payload
      request.body.read
    end

    private def signature_header
      request.env['HTTP_STRIPE_SIGNATURE']
    end

    private def stripe_webhook_event
      StripeWebhookEvent.create!(event_type: event.type, external_id: event.id)
    end
  end
end
