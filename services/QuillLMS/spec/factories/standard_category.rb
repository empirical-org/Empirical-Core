# frozen_string_literal: true

FactoryBot.define do
  factory :standard_category do
    sequence(:name) { |i| "Standard Category #{i}" }

    trait :with_change_log do
      after(:create) do |t|
        create(:change_log, changed_record: t)
      end
    end

  end
end
