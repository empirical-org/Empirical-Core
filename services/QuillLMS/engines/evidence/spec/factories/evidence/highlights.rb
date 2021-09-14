FactoryBot.define do
  factory :evidence_highlight, class: 'Evidence::Highlight' do
    association :feedback, factory: :evidence_feedback
    text { "Highlight me" }
    highlight_type { "passage" }
    starting_index { 0 }
  end
end
