# frozen_string_literal: true

FactoryBot.define do
  factory :activity_pack_release_unit do
    activity_pack_release
    unit
    sequence(:order) { |n| n }
  end
end
