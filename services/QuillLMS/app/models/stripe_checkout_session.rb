# frozen_string_literal: true

# == Schema Information
#
# Table name: stripe_checkout_sessions
#
#  id                           :bigint           not null, primary key
#  school_ids                   :integer          default([]), is an Array
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

  def self.custom_find_or_create_by!(external_checkout_session_args:, school_ids:, stripe_price_id:, user_id:)
    stripe_checkout_session = StripeCheckoutSession.find_by(
      school_ids: school_ids,
      stripe_price_id: stripe_price_id,
      user_id: user_id
    )

    return stripe_checkout_session if stripe_checkout_session.present?

    external_checkout_session = Stripe::Checkout::Session.create(external_checkout_session_args)

    StripeCheckoutSession.create!(
      external_checkout_session_id: external_checkout_session.id,
      school_ids: school_ids,
      stripe_price_id: stripe_price_id,
      url: external_checkout_session.url,
      user_id: user_id
    )
  end
end
