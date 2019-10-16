FactoryBot.define do
  factory :partner_curriculum do
    partner  PartnerCurriculum::AMPLIFY
    curriculum { create(:unit_template) }
  end
end
