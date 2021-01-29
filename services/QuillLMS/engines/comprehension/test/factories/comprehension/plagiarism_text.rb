FactoryBot.define do
  factory :comprehension_plagiarism_text, class: 'Comprehension::PlagiarismText' do
    association :rule, factory: :comprehension_rule
    text { "This is the passage of text that we want to use to check for plagiarism." }
  end
end
