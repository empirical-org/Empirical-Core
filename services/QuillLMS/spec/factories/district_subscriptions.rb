# frozen_string_literal: true

# == Schema Information
#
# Table name: district_subscriptions
#
#  id              :bigint           not null, primary key
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  district_id     :bigint
#  subscription_id :bigint
#
# Indexes
#
#  index_district_subscriptions_on_district_id      (district_id)
#  index_district_subscriptions_on_subscription_id  (subscription_id)
#
# Foreign Keys
#
#  fk_rails_...  (district_id => districts.id)
#  fk_rails_...  (subscription_id => subscriptions.id)
#
FactoryBot.define do
  factory :district_subscription do
    district
    subscription
  end
end
