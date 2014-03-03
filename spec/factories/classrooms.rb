FactoryGirl.define do
  factory :classroom do
    teacher
    sequence(:name) { |n| "Classroom #{n}" }
    sequence(:code) { |n| "code-#{n}" }
  end
end