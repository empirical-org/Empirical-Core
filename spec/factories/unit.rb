FactoryBot.define do
  factory :unit do
    sequence(:name) { |i| "Unit #{i}" }
    user_id         { create(:teacher).id }

    trait :sentence_structure_diagnostic do
      name { 'Sentence Structure Diagnostic' }
    end
  end
end
