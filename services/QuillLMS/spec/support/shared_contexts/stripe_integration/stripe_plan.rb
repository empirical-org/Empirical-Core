# frozen_string_literal: true

require 'rails_helper'

RSpec.shared_context 'Stripe Plan' do
  include_context 'Stripe Price'

  let(:stripe_plan) do
    Stripe::Plan.construct_from(
      plan: {
        id: stripe_price_id,
        object: 'plan',
        active: true,
        aggregate_usage: nil,
        amount: 8000,
        amount_decimal: '8000',
        billing_scheme: 'per_unit',
        created: 1647349612,
        currency: 'usd',
        interval: 'year',
        interval_count: 1,
        livemode: false,
        metadata: {},
        nickname: nil,
        product: stripe_product_id,
        tiers_mode: nil,
        transform_usage: nil,
        trial_period_days: nil,
        usage_type: 'licensed'
      }
    )
  end
end
