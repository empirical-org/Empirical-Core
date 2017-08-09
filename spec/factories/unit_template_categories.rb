FactoryGirl.define do
  factory :unit_template_category do
    sequence(:name) {|i| "Unit Template Category #{i}"}
    primary_color {'periwinkle'}
    secondary_color {'fuschia'}
  end

end
