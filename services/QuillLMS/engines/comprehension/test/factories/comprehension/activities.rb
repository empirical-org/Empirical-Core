FactoryBot.define do
  factory :comprehension_activity, class: 'Comprehension::Activity' do
    sequence(:title) {|n| "MyString #{n}" }
    sequence(:name) {|n| "MyString #{n}" }
    target_level { 1 }
  end
end
