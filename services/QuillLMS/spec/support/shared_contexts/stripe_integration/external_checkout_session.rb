# frozen_string_literal: true

RSpec.shared_context 'External Checkout Session' do
  include_context 'Stripe Customer'

  let(:external_checkout_session_id) { "cs_#{SecureRandom.hex}" }

  let(:external_checkout_session) do
    Stripe::Invoice.construct_from(
      id: external_checkout_session_id,
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
      cancel_url: 'http://localhost:3000/premium',
      client_reference_id: nil,
      consent: nil,
      consent_collection: nil,
      currency: 'usd',
      customer: stripe_customer_id,
      customer_creation: nil,
      customer_details: {
        address: nil,
        email: customer_email,
        name: nil,
        phone: nil,
        tax_exempt: nil,
        tax_ids: nil
      },
      customer_email: nil,
      expires_at: 1654609711,
      livemode: false,
      locale: nil,
      metadata: {},
      mode: 'subscription',
      payment_intent: nil,
      payment_link: nil,
      payment_method_options: nil,
      payment_method_types: ['card'],
      payment_status: 'unpaid',
      phone_number_collection: {
        enabled: false
      },
      recovered_from: nil,
      setup_intent: nil,
      shipping: nil,
      shipping_address_collection: nil,
      shipping_options: [],
      shipping_rate: nil,
      status: stripe_checkout_session_status,
      submit_type: nil,
      subscription: nil,
      success_url: "http://localhost:3000/subscriptions?checkout_session_id={CHECKOUT_SESSION_ID}",
      total_details: {
        amount_discount: 0,
        amount_shipping: 0,
        amount_tax: 0
      },
      url: nil
    )
  end
end
