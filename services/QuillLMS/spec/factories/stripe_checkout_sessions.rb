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
FactoryBot.define do
  factory :stripe_checkout_session do
    external_checkout_session_id { "cs_#{SecureRandom.hex}" }
    school_ids { [] }
    stripe_price_id { "price_#{SecureRandom.hex}" }
    url { "https://www.checkout.stripe/pay/cs_#{SecureRandom.hex}" }
    user
  end
end
