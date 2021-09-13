FactoryBot.define do
  factory :evidence_activity, class: 'Evidence::Activity' do
    sequence(:title) {|n| "MyString #{n}" }
    sequence(:notes) {|n| "MyString #{n}" }
    target_level { 1 }
  end
end
