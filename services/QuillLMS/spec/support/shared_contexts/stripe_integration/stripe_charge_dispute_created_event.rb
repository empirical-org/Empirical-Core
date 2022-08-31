# frozen_string_literal: true

RSpec.shared_context 'Stripe Charge Dispute Created Event' do
  include_context 'Stripe Dispute'

  let(:stripe_event_id) { "evt_#{SecureRandom.hex}"}
  let(:stripe_event_type) { 'charge.dispute.created' }

  let(:stripe_event) do
    Stripe::Event.construct_from(
      id: stripe_event_id,
      object: 'event',
      api_version: '2020-08-27',
      created: 1654609712,
      data: {
        object: stripe_dispute
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
