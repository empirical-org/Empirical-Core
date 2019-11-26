FactoryBot.define do
  factory :question_type do
    trait(:connect)      { name    "connect_sentence_combining" }
    trait(:diagnostic)   { name    "diagnostic_sentence_combining" }
  end
end
