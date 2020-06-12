FactoryBot.define do
  factory :comprehension_activity, class: 'Comprehension::Activity' do
    title { "MyString" }
    parent_activity_id { 1 }
    target_level { 1 }
  end
end
