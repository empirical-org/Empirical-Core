# frozen_string_literal: true

RSpec.shared_context 'Stripe Setup Intent' do
  include_context 'Stripe Subscription'

  let(:stripe_setup_intent_id) { "seti_#{SecureRandom.hex}" }
  let(:stripe_payment_method_id) { "pm_#{SecureRandom.hex}"}

  let(:stripe_setup_intent) do
    Stripe::SetupIntent.construct_from(
      id: stripe_setup_intent_id,
      object: 'setup_intent',
      application: nil,
      cancellation_reason: nil,
      client_secret: "#{stripe_setup_intent_id}_secret_LV7Q1i59ro77KkmfNL06d2HGWt5aX3C",
      created: 1649860139,
      customer: stripe_customer_id,
      description: nil,
      last_setup_error: nil,
      latest_attempt: 'setatt_1Ko7C5BuKMgoObiuF48Fepp0',
      livemode: false,
      mandate: nil,
      metadata: {
        subscription_id: stripe_subscription_id
      },
      next_action: nil,
      on_behalf_of: nil,
      payment_method: stripe_payment_method_id,
      payment_method_options: {
        card: {
          mandate_options: nil,
          request_three_d_secure: 'automatic'
        }
      },
      payment_method_types: [
        'card'
      ],
      single_use_mandate: nil,
      status: 'succeeded',
      usage: 'off_session'
    )
  end
end
