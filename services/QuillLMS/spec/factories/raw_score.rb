FactoryBot.define do
  factory :raw_score do
    sequence(:name) { |i| "Raw Score #{i}" }
    trait :eight_hundred_to_nine_hundred do
      name { '800-900' }
    end

    trait :five_hundred_to_six_hundred do
      name { '500-600' }
    end
  end
end
