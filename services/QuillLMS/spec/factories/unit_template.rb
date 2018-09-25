FactoryBot.define do
  factory :simple_unit_template, class: 'UnitTemplate' do; end

  factory :unit_template do
    sequence(:name) do |i|
      loop do
        possible_name = "Unit Template #{i}"
        break possible_name unless UnitTemplate.exists?(name: possible_name)
      end
    end
    author                  { create(:author) }
    unit_template_category  { create(:unit_template_category) }

    factory :unit_template_with_activities do
      activities              { build_list(:activity, 3) }
    end
  end

end
