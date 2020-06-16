FactoryBot.define do
  factory :comprehension_passage, class: 'Comprehension::Passage' do
    association :activity, factory: :comprehension_activity
    text { "The beginning of a wonderful passage. And more information goes here." }
  end
end
