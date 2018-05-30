FactoryBot.define do
  factory :firebase_app do
    sequence(:name) { |i| "Firebase App #{i}" }
    sequence(:secret) { (1..40).map{(('a'..'z').to_a + ('A'..'Z').to_a).sample}.join }

    factory :grammar_firebase_app do
      name { 'quillgrammar' }
    end
  end
end
