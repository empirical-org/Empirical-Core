FactoryGirl.define do
  factory :classroom do
    sequence(:name) { |n| "Classroom #{n}" }
    sequence(:code) { |n| "code-#{n}" }
  end
end