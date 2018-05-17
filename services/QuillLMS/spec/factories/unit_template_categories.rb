FactoryBot.define do
  factory :unit_template_category do
    sequence(:name) {|i| "Unit Template Category #{i}" }
    primary_color   { Faker::Color.hex_color }
    secondary_color { Faker::Color.hex_color }
  end
end
