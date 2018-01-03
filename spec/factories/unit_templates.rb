FactoryBot.define do
  factory :unit_template do
    sequence(:name)         { |i| "Unit Template #{i}" }
    author                  { create(:author) }
    unit_template_category  { create(:unit_template_category) }
  end
end
