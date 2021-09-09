FactoryBot.define do
  factory :evidence_plagiarism_text, class: 'Evidence::PlagiarismText' do
    association :rule, factory: :evidence_rule
    text { "This is the passage of text that we want to use to check for plagiarism." }
  end
end
