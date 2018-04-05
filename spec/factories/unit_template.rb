FactoryBot.define do
  factory :unit_template do
    sequence(:name)         { |i| "Unit Template #{i}" }
    author                  { create(:author) }
    unit_template_category  { create(:unit_template_category) }
  end

  factory :unit_template_with_activities do
    activities              { build_list(:activity, 3) }
  end
end
