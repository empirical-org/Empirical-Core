# frozen_string_literal: true

Rails.configuration.stripe = {
  :publishable_key => ENV['PUBLISHABLE_KEY'],
  :secret_key      => ENV['STRIPE_SECRET_KEY']
}

Stripe.api_key = Rails.configuration.stripe[:secret_key]

STRIPE_SCHOOL_PLAN_PRICE_ID = ENV.fetch('STRIPE_SCHOOL_PLAN_PRICE_ID') { "price_#{SecureRandom.hex}" if Rails.env.test? }
STRIPE_TEACHER_PLAN_PRICE_ID = ENV.fetch('STRIPE_TEACHER_PLAN_PRICE_ID') { "price_#{SecureRandom.hex}" if Rails.env.test? }
