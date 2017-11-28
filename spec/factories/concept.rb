FactoryBot.define do
  factory :concept do
    sequence(:name) { |i| "Concept #{i}" }
    uid             { SecureRandom.urlsafe_base64 }
  end
end
