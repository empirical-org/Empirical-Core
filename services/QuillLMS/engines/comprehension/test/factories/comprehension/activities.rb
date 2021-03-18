FactoryBot.define do
  factory :comprehension_activity, class: 'Comprehension::Activity' do
    title { "MyString" }
    name { "MyString" }
    sequence(:parent_activity_id)
    target_level { 1 }
  end
end
