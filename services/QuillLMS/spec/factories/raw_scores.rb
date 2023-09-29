# frozen_string_literal: true

# == Schema Information
#
# Table name: raw_scores
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  order      :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
FactoryBot.define do
  factory :raw_score do
    sequence(:name) { |i| "Raw Score #{i}" }
    order { rand(100) }
    trait :eight_hundred_to_nine_hundred do
      name { '800-900' }
      order { 8 }
    end

    trait :five_hundred_to_six_hundred do
      name { '500-600' }
      order { 5 }
    end

    trait :four_hundred_to_five_hundred do
      name { '400-500' }
      order { 4 }
    end
  end
end
