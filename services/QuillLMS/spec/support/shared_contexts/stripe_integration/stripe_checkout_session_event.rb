# frozen_string_literal: true

RSpec.shared_context 'Stripe Checkout Session Event' do
  include_context 'Stripe Checkout Session'

  let(:stripe_event) do
    Stripe::Event.construct_from(
      {
        id: stripe_event_id,
        object: 'event',
        api_version: '2020-08-27',
        created: 1648487559,
        data:  {
          object: stripe_checkout_session
        },
        livemode: false,
        pending_webhooks: 3,
        request: {
          id: 'req_ji2VMrCOabDEc7',
          idempotency_key: '14e52478-1935-43a8-ac5e-96bbc039706f'
        },
        type: 'checkout.session.completed'
      }
    )
  end
end
