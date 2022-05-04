# frozen_string_literal: true

RSpec.shared_context 'Stripe Payment Method' do
  include_context 'Stripe Card'

  let(:stripe_payment_method_id) { "pm_#{SecureRandom.hex}"}

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
      card: stripe_card,
      created: 1649425992,
      customer: stripe_customer_id,
      livemode: false,
      metadata: {},
      type: 'card'
    )
  }
end
