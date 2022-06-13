# frozen_string_literal: true

FactoryBot.define do
  factory :concept do
    sequence(:name) { |i| "Concept #{i}" }
    uid             { SecureRandom.urlsafe_base64 }

    factory :concept_with_parent do
      parent_id {create(:concept).id}
    end

    factory :concept_with_grandparent do
      parent_id {create(:concept_with_parent).id}
    end
  end
end
