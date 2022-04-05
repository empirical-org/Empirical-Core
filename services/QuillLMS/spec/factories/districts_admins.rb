# frozen_string_literal: true

# == Schema Information
#
# Table name: districts_admins
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  district_id :bigint           not null
#  user_id     :bigint           not null
#
# Indexes
#
#  index_districts_admins_on_district_id  (district_id)
#  index_districts_admins_on_user_id      (user_id)
#
FactoryBot.define do
  factory :districts_admins do
    district { create(:district) }
    user { create(:user) }
  end
end
