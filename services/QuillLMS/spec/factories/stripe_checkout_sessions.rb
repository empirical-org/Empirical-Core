# frozen_string_literal: true

FactoryBot.define do
  factory :stripe_checkout_session do
    expiration { 24.hours.from_now }
    external_checkout_session_id { "cs_#{SecureRandom.hex}" }
    stripe_price_id { "price_#{SecureRandom.hex}" }
    url { "https://www.checkout.stripe/pay/cs_#{SecureRandom.hex}" }
    user
  end
end
