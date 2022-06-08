# frozen_string_literal: true

# == Schema Information
#
# Table name: stripe_checkout_sessions
#
#  id                           :bigint           not null, primary key
#  expiration                   :datetime         not null
#  url                          :string           not null
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  external_checkout_session_id :string           not null
#  stripe_price_id              :string           not null
#  user_id                      :bigint
#
# Indexes
#
#  index_stripe_checkout_sessions_on_external_checkout_session_id  (external_checkout_session_id)
#  index_stripe_checkout_sessions_on_user_id                       (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
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
