# frozen_string_literal: true

RSpec.shared_context "Stripe Price" do
  let(:stripe_price_id) { STRIPE_TEACHER_PLAN_PRICE_ID }
  let(:stripe_product_id) { "prod_#{SecureRandom.hex}" }

  before { create(:teacher_premium_plan) }

  let(:stripe_price) do
    Stripe::Price.construct_from(
      id: stripe_price_id,
      object: 'price',
      active: true,
      billing_scheme: 'per_unit',
      created: 1647349612,
      currency: 'usd',
      livemode: false,
      lookup_key: nil,
      metadata: {},
      nickname: nil,
      product: stripe_product_id,
      recurring: {
        aggregate_usage: nil,
        interval: 'year',
        interval_count: 1,
        usage_type: 'licensed'
      },
      tax_behavior: 'unspecified',
      tiers_mode: nil,
      transform_quantity: nil,
      type: 'recurring',
      unit_amount: 8000,
      unit_amount_decimal: '8000'
    )
  end
end

