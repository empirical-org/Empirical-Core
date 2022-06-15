# frozen_string_literal: true

RSpec.shared_context 'Stripe Setup Intent Succeeded Event' do
  include_context 'Stripe Setup Intent'

  let(:stripe_setup_intent_event_id) { "evt_#{SecureRandom.hex}" }
  let(:stripe_event_type) { 'setup_intent.succeeded' }

  let(:stripe_event) do
    Stripe::Event.construct_from(
      id: stripe_setup_intent_event_id,
      object: 'event',
      api_version: '2020-08-27',
      created: 1649860158,
      data: {
        object: stripe_setup_intent
      },
      livemode: false,
      pending_webhooks: 3,
      request: {
        id: "req_#{SecureRandom.hex}",
        idempotency_key: nil
      },
      type: stripe_event_type
    )
  end
end
