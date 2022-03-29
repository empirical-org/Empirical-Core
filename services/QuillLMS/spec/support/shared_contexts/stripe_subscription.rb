# frozen_string_literal: true

RSpec.shared_context 'Stripe Subscription' do
  include_context 'Stripe Plan'
  include_context 'Stripe Customer'

  let(:stripe_subscription_id) { "sub_#{SecureRandom.hex}" }

  let(:stripe_subscription) do
    Stripe::Subscription.construct_from(
      id: stripe_subscription_id,
      object: 'subscription',
      application_fee_percent: nil,
      automatic_tax: {
        enabled: false
      },
      billing_cycle_anchor: 1647884415,
      billing_thresholds: nil,
      cancel_at: nil,
      cancel_at_period_end: false,
      canceled_at: nil,
      collection_method: 'charge_automatically',
      created: 1647884415,
      current_period_end: 1679420415,
      current_period_start: 1647884415,
      customer: stripe_customer_id,
      days_until_due: nil,
      default_payment_method: 'pm_1KfpDGBuKMgoObiusdqCeP0U',
      default_source: nil,
      default_tax_rates: [],
      discount: nil,
      ended_at: nil,
      items: {
        object: 'list',
        data: [
          {
            id: 'si_LMYJmB1ZVMsHkV',
            object: 'subscription_item',
            billing_thresholds: nil,
            created: 1647884416,
            metadata: {},
            price: {
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
              product: 'prod_LKEUTiOEnuAy87',
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
            },
            quantity: 1,
            subscription: stripe_subscription_id,
            tax_rates: []
          }
        ],
        has_more: false,
        url: "/v1/subscription_items?subscription=#{stripe_subscription_id}"
      },
      latest_invoice: 'in_1KfpDIBuKMgoObiuQVX5JBiR',
      livemode: false,
      metadata: {},
      next_pending_invoice_item_invoice: nil,
      pause_collection: nil,
      payment_settings: {
        payment_method_options: nil,
        payment_method_types: nil
      },
      pending_invoice_item_interval: nil,
      pending_setup_intent: nil,
      pending_update: nil,
      schedule: nil,
      start_date: 1647884415,
      status: 'active',
      test_clock: nil,
      transfer_data: nil,
      trial_end: nil,
      trial_start: nil
    )
  end
end
