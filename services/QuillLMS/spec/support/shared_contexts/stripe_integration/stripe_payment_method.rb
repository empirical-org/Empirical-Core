# frozen_string_literal: true

RSpec.shared_context 'Stripe Payment Method' do
  include_context 'Stripe Customer'

  let(:stripe_payment_method_id) { "pm_#{SecureRandom.hex}"}
  let(:last_four) { rand.to_s[2..5] }

  let(:stripe_payment_method) {
    Stripe::PaymentMethod.construct_from(
      id: stripe_payment_method_id,
      object: 'payment_method',
      billing_details: {
        address: {
          city: nil,
          country: 'US',
          line1: nil,
          line2: nil,
          postal_code: '42424',
          state: nil
        },
        email: customer_email,
        name: customer.name,
        phone: nil
      },
      card: {
        brand: 'visa',
        checks: {
          address_line1_check: nil,
          address_postal_code_check: 'pass',
          cvc_check: 'pass'
        },
        country: 'US',
        exp_month: 4,
        exp_year: 2024,
        fingerprint: 'CfWL1fijit7RIs4U',
        funding: 'credit',
        generated_from: nil,
        last4: last_four,
        networks: {
          available: ['visa'],
          preferred: nil
        },
        three_d_secure_usage: {
          supported: true
        },
        wallet: nil
      },
      created: 1649425992,
      customer: stripe_customer_id,
      livemode: false,
      metadata: {},
      type: 'card'
    )
  }
end
