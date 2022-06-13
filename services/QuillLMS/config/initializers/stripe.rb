# frozen_string_literal: true

Rails.configuration.stripe = {
  :publishable_key => ENV['PUBLISHABLE_KEY'],
  :secret_key      => ENV['STRIPE_SECRET_KEY']
}

Stripe.api_key = Rails.configuration.stripe[:secret_key]

STRIPE_DASHBOARD_URL = ENV.fetch('STRIPE_DASHBOARD_URL', nil)
STRIPE_SCHOOL_PLAN_PRICE_ID = ENV.fetch('STRIPE_SCHOOL_PLAN_PRICE_ID', nil)
STRIPE_TEACHER_PLAN_PRICE_ID = ENV.fetch('STRIPE_TEACHER_PLAN_PRICE_ID', nil)
