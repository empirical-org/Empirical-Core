FactoryGirl.define do
  factory :classroom_chapter do
    classroom
    chapter
    sequence(:classcode) { |n| "classcode#{n}" }
  end
end