# frozen_string_literal: true

RSpec.shared_context 'Stripe Customer Subscription Deleted Event' do
  include_context 'Stripe Subscription'

  let(:stripe_event_id) { "evt_#{SecureRandom.hex}"}
  let(:stripe_event_type) { 'customer.subscription.deleted' }

  let(:stripe_event) do
    Stripe::Event.construct_from(
      {
        id: stripe_event_id,
        object: 'event',
        api_version: '2020-08-27',
        created: 1652445524,
        data: {
          object: stripe_subscription
        },
        livemode: false,
        pending_webhooks: 5,
        request: {
          id: 'req_mXcxePTuuzOGt6',
          idempotency_key: nil
        },
        type: stripe_event_type
      }
    )
  end
end
