FactoryBot.define do
  factory :ip_location do
    country 'United States'
    city    { "New York City" }
    state   { "NY" }
    zip     { "10003" }
  end
end
