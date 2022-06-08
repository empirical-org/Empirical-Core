# frozen_string_literal: true

RSpec.shared_context 'Stripe Checkout Session Expired Event' do
  include_context 'External Checkout Session'

  let(:stripe_event_id) { "evt_#{SecureRandom.hex}"}
  let(:stripe_event_type) { 'checkout.session.expired' }
  let(:stripe_checkout_session_status) { 'expired' }

  let(:stripe_event) do
    Stripe::Event.construct_from(
      id: stripe_event_id,
      object: 'event',
      api_version: '2020-08-27',
      created: 1654609712,
      data:  {
        object: external_checkout_session
      },
      livemode: false,
      pending_webhooks: 3,
      request: {
        id: 'req_ji2VMrCOabDEc7',
        idempotency_key: '14e52478-1935-43a8-ac5e-96bbc039706f'
      },
      type: stripe_event_type
    )
  end
end
