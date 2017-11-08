FactoryBot.define do
  factory :unit_template do
    sequence(:name) {|i| "Unit Template #{i}"}
    author {Author.first  || FactoryBot.create(:author)}
    unit_template_category { UnitTemplateCategory.first  || FactoryBot.create(:unit_template_category) }
  end
end
