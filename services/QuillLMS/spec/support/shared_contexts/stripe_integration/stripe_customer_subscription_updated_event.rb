# frozen_string_literal: true

RSpec.shared_context 'Stripe Customer Subscription Updated Event' do
  include_context 'Stripe Subscription'
  include_context 'Stripe Payment Method'

  let(:stripe_event_id) { "evt_#{SecureRandom.hex}"}
  let(:stripe_event_type) { StripeIntegration::Webhooks::CustomerSubscriptionUpdatedEventHandler::EVENT_TYPE }

  let(:stripe_event) do
    Stripe::Event.construct_from(
      id: stripe_event_id,
      object: 'event',
      api_version: '2020-08-27',
      created: 1650057070,
      data: stripe_subscription,
      livemode: false,
      pending_webhooks: 0,
      request: {
        id: 'req_1BajQOOl77CRJO',
        idempotency_key: '954fc35e-fbff-40c5-954f-d34918ed2280'
      },
      type: stripe_event_type
    )
  end
end
