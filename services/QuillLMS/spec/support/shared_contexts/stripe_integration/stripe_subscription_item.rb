# frozen_string_literal: true

require 'rails_helper'

RSpec.shared_context 'Stripe Subscription Item' do
  include_context 'Stripe Plan'

  let(:stripe_subscription_item_id) { "si_#{SecureRandom.hex}" }

  let(:stripe_subscription_item) do
    Stripe::SubscriptionItem.construct_from(
      id: stripe_subscription_item_id,
      object: 'subscription_item',
      billing_thresholds: nil,
      created: 1647884416,
      metadata: {},
      plan: stripe_plan,
      price: stripe_price,
      quantity: 1,
      subscription: stripe_subscription_id,
      tax_rates: []
    )
  end
end

