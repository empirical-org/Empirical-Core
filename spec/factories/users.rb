FactoryBot.define do
  factory :user do
    name      { Faker::Name.unique.name }
    username  { name.gsub(' ', '-') }
    password  { Faker::Internet.password }
    email     { Faker::Internet.safe_email(name.gsub(' ', '.')) }

    factory :staff do
      role 'staff'
    end

    factory :admin do
      role 'admin'
    end

    factory :teacher do
      role 'teacher'

      factory :teacher_with_classrooms_students_and_activities do
        classrooms_i_teach {
          [
            FactoryBot.create(:classroom_with_students_and_activities),
            FactoryBot.create(:classroom_with_students_and_activities)
          ]
        }
      end
    end

    factory :student do
      role 'student'

      trait :in_one_classroom do
        classrooms { [ FactoryBot.create(:classroom) ]}
      end

      factory :student_with_many_activities do
        classrooms { [ FactoryBot.create(:classroom) ] }
        transient do
          activity_count 5
        end
        after(:create) do |user, evaluator|
          create_list(:activity_session, evaluator.activity_count, user: user)
        end
      end
    end
  end
end
