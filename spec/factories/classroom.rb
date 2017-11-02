FactoryBot.define do
  factory :classroom do
    teacher
    name  { "#{teacher.name}'s Classroom'" }
    grade { [(1..12).to_a, 'University', 'Kindergarten', 'Other'].flatten.sample.to_s }

    factory :classroom_with_a_couple_students do
      students {
        [
          FactoryBot.create(:student),
          FactoryBot.create(:student)
        ]
      }
    end

    factory :classroom_with_one_student do
      students {
        [FactoryBot.create(:student)]
      }
    end

    factory :classroom_with_students_and_activities do
      students {
        [
          FactoryBot.create(:student_with_many_activities),
          FactoryBot.create(:student_with_many_activities),
          FactoryBot.create(:student_with_many_activities),
          FactoryBot.create(:student_with_many_activities),
          FactoryBot.create(:student_with_many_activities)
        ]
      }
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
