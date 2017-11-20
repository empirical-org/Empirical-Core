FactoryBot.define do
  factory :ip_location do
    country 'United States'
    city    { Faker::Address.city }
    state   { Faker::Address.state }
    zip     { Faker::Address.zip }
  end
end
