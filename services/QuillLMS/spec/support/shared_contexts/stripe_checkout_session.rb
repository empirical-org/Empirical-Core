# frozen_string_literal: true

RSpec.shared_context 'Stripe Checkout Session' do
  include_context 'Stripe Subscription'

  let(:checkout_session_id) { "cs_test_#{SecureRandom.hex}" }

  let(:stripe_checkout_session_data) do
    Stripe::Checkout::Session.construct_from(
      id: checkout_session_id,
      object: 'checkout.session',
      after_expiration: nil,
      allow_promotion_codes: nil,
      amount_subtotal: 8000,
      amount_total: 8000,
      automatic_tax: {
        enabled: false,
        status: nil
      },
      billing_address_collection: nil,
      cancel_url: "#{ENV['DEFAULT_URL']}/premium",
      client_reference_id: nil,
      consent: nil,
      consent_collection: nil,
      currency: 'usd',
      customer: stripe_customer_id,
      customer_creation: 'always',
      customer_details: {
        email: customer_email,
        phone: nil,
        tax_exempt: 'none',
        tax_ids: []
      },
      customer_email: customer_email,
      expires_at: 1647970794,
      livemode: false,
      locale: nil,
      metadata: {},
      mode: 'subscription',
      payment_intent: nil,
      payment_link: nil,
      payment_method_options: nil,
      payment_method_types: [
        'card'
      ],
      payment_status: 'paid',
      phone_number_collection: {
        enabled: false
      },
      recovered_from: nil,
      setup_intent: nil,
      shipping: nil,
      shipping_address_collection: nil,
      shipping_options: [],
      shipping_rate: nil,
      status: 'complete',
      submit_type: nil,
      subscription: stripe_subscription_id,
      success_url: "#{ENV['DEFAULT_URL']}/subscription?checkout_session_id=#{checkout_session_id}",
      total_details: {
        amount_discount: 0,
        amount_shipping: 0,
        amount_tax: 0
      },
      url: nil
    )
  end
end
