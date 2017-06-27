FactoryGirl.define do

  factory :unit_template do
    sequence(:name) {|i| "Unit Template #{i}"}
    author {Author.first  || FactoryGirl.create(:author)}
    unit_template_category { UnitTemplateCategory.first  || FactoryGirl.create(:unit_template_category) }
  end
end
