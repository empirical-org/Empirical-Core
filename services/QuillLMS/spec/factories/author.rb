FactoryBot.define do
  factory :author do
    sequence(:name) { |n| "#{Faker::Name.unique.name} #{n}"}
    avatar { Faker::Placeholdit.image }
  end
end
