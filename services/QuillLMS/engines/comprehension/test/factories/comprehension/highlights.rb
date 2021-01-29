FactoryBot.define do
  factory :comprehension_highlight, class: 'Comprehension::Highlight' do
    association :feedback, factory: :comprehension_feedback
    text { "Highlight me" }
    highlight_type { "passage" }
    starting_index { 0 }
  end
end
