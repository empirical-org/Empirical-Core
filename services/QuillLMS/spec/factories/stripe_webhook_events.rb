# frozen_string_literal: true

# == Schema Information
#
# Table name: stripe_webhook_events
#
#  id                :bigint           not null, primary key
#  data              :jsonb            not null
#  event_type        :string           not null
#  processing_errors :string
#  status            :string           default("pending")
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  external_id       :string           not null
#
# Indexes
#
#  index_stripe_webhook_events_on_external_id  (external_id) UNIQUE
#
FactoryBot.define do
  factory :stripe_webhook_event, aliases: [:checkout_session_completed_webhook_event]  do
    event_type { StripeIntegration::Webhooks::CheckoutSessionCompletedEventHandler::EVENT_TYPE }
    data { {}.to_json }
    external_id { SecureRandom.hex }

    factory :unhandled_stripe_webhook_event do
      event_type { 'unhandled.webhook.event' }
    end
  end
end
