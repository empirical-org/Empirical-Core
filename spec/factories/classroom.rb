FactoryBot.define do
  factory :classroom do
    sequence(:name) { |i| "classroom #{i}" }
    teacher
    grade '8'

    trait :with_a_couple_students do
      students {
        [
          FactoryBot.create(:student),
          FactoryBot.create(:student)
        ]
      }
    end

    factory :classroom_with_one_student do
      after(:create) do |classroom, evaluator|
        create_list(:user, 1, classrooms: [classroom])
      end
    end

    factory :sweathogs do
      name  'Sweathogs'
      grade '11'
    end

    factory :classroom_with_classroom_activities do
      after(:create) do |classroom|
        create_list(:classroom_activity_with_activity_sessions, 5, classroom: classroom)
      end
    end
  end
end
