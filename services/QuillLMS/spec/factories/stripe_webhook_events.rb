# frozen_string_literal: true

# == Schema Information
#
# Table name: stripe_webhook_events
#
#  id                :bigint           not null, primary key
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
  factory :stripe_webhook_event, aliases: [:invoice_paid_stripe_webhook_event]  do
    event_type { StripeIntegration::Webhooks::InvoicePaidEventHandler::EVENT_TYPE }
    external_id { "evt_#{SecureRandom.hex}" }

    factory :ignored_stripe_webhook_event do
      event_type { StripeIntegration::Webhooks::IgnoredEventHandler::IGNORED_EVENTS.sample }
    end

    factory :unknown_stripe_webhook_event do
      event_type { 'unknown.webhook.event' }
    end
  end
end
