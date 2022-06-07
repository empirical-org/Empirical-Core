# frozen_string_literal: true

class StripeCheckoutSession < ApplicationRecord
  belongs_to :user

  scope :not_expired, -> { where('expiration > ?', DateTime.now.utc) }

  def self.custom_find_or_create_by!(external_checkout_session_args, stripe_price_id, user_id)
    stripe_checkout_session = StripeCheckoutSession.not_expired.find_by(stripe_price_id: stripe_price_id, user_id: user_id)
    return stripe_checkout_session if stripe_checkout_session.present?

    external_checkout_session = Stripe::Checkout::Session.create(external_checkout_session_args)

    StripeCheckoutSession.create!(
      expiration: Time.at(external_checkout_session.expires_at).utc.to_datetime,
      external_checkout_session_id: external_checkout_session.id,
      stripe_price_id: stripe_price_id,
      url: external_checkout_session.url,
      user_id: user_id
    )
  end
end
