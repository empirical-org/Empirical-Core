FactoryBot.define do
  factory :topic do
    name            { "Test topic" }
    level           { 3 }
    visible         { "true" }
  end
end
