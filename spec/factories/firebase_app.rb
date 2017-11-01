FactoryBot.define do

  factory :firebase_app do
    sequence(:name) { |i| "firebase app #{i}" }
    sequence(:secret) { |i| "secret#{i}"}
  end
end
