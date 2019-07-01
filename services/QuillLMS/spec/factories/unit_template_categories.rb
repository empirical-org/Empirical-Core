FactoryBot.define do
  factory :unit_template_category do
    sequence(:name) {|i| "Unit Template Category #{i}" }
    primary_color   { "#000000" }
    secondary_color { "#ffffff" }
  end
end
