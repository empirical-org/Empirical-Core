FactoryBot.define do
  factory :activities_unit_template do
    unit_template { create(:unit_template) }
    activity { create(:activity) }
  end
end