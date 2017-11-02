FactoryBot.define do
  factory :author do
    name { Faker::Name.unique.name }
    avatar { Faker::Placeholdit.image }
  end
end
