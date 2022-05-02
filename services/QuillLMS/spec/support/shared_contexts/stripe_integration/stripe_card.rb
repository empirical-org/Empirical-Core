# frozen_string_literal: true

RSpec.shared_context 'Stripe Card' do
  include_context 'Stripe Customer'

  let(:stripe_card_id) { "card_#{SecureRandom.hex}" }
  let(:stripe_last_four) { srand.to_s.last(4) }

  let(:stripe_card) do
    Stripe::Card.construct_from(
      id: stripe_card_id,
      object: 'card',
      address_city: nil,
      address_country: nil,
      address_line1: nil,
      address_line1_check: nil,
      address_line2: nil,
      address_state: nil,
      address_zip: nil,
      address_zip_check: nil,
      brand: 'Visa',
      country: 'US',
      customer: stripe_customer_id,
      cvc_check: 'pass',
      dynamic_last4: nil,
      exp_month: 1,
      exp_year: 2024,
      fingerprint: nil,
      funding: 'credit',
      last4: stripe_last_four,
      metadata: {},
      name: customer.name,
      tokenization_method: nil
    )
  end
end
