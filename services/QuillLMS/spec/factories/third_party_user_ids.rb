# frozen_string_literal: true

# == Schema Information
#
# Table name: third_party_user_ids
#
#  id             :integer          not null, primary key
#  source         :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  third_party_id :string
#  user_id        :integer
#
# Indexes
#
#  index_third_party_user_ids_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :third_party_user_id do
    user { create(:student) }
    source { ThirdPartyUserId::VALID_SOURCES.sample }
    third_party_id { rand(100000000) }
  end
end

