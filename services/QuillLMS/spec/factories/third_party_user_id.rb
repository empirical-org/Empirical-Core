# frozen_string_literal: true

FactoryBot.define do
  factory :third_party_user_id do
    user            { create(:student) }
    source          ThirdPartyUserId::VALID_SOURCES.sample
    third_party_id  { rand(100000000) }
  end
end

