# frozen_string_literal: true

RSpec.shared_context 'Stripe Subscription' do
  include_context 'Stripe Subscription Item'
  include_context 'Stripe Payment Method'
  include_context 'Stripe Customer'

  let(:stripe_subscription_id) { "sub_#{SecureRandom.hex}" }
  let(:stripe_subscription_cancel_at_period_end) { false }
  let(:stripe_subscription_current_period_end) { 1.year.from_now.to_i }
  let(:stripe_subscription_current_period_start) { Date.current.to_time.to_i }
  let(:stripe_subscription_canceled_at) { nil }
  let(:stripe_subscription_metadata) { {} }
  let(:stripe_subscription_status) { 'active' }

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
      cancel_at_period_end: stripe_subscription_cancel_at_period_end,
      canceled_at: stripe_subscription_canceled_at,
      collection_method: 'charge_automatically',
      created: 1647884415,
      current_period_end: stripe_subscription_current_period_end,
      current_period_start: stripe_subscription_current_period_start,
      customer: stripe_customer_id,
      days_until_due: nil,
      default_payment_method: stripe_payment_method_id,
      default_source: nil,
      default_tax_rates: [],
      discount: nil,
      ended_at: nil,
      items: {
        object: 'list',
        data: [
          stripe_subscription_item
        ],
        has_more: false,
        url: "/v1/subscription_items?subscription=#{stripe_subscription_id}"
      },
      latest_invoice: nil,
      livemode: false,
      metadata: stripe_subscription_metadata,
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
      status: stripe_subscription_status,
      test_clock: nil,
      transfer_data: nil,
      trial_end: nil,
      trial_start: nil
    )
  end
end
