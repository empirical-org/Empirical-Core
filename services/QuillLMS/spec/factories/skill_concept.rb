FactoryBot.define do
  factory :skill_concept do
    skill { create(:skill) }
    concept { create(:concept) }
  end
end
