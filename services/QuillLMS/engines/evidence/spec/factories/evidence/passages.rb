FactoryBot.define do
  factory :evidence_passage, class: 'Evidence::Passage' do
    association :activity, factory: :evidence_activity
    text { "The beginning of a wonderful passage. And more information goes here." }
  end
end
