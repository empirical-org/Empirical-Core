# Read about factories at https://github.com/thoughtbot/factory_bot

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

      trait :with_a_couple_classroms_with_students do
        classrooms_i_teach {
          [
            FactoryBot.create(:classroom, :with_a_couple_students),
            FactoryBot.create(:classroom, :with_a_couple_students)
          ]
        }
      end

      factory :teacher_with_students_with_activities do
        classrooms_i_teach {
          [ FactoryBot.create(:classroom,
            students: [FactoryBot.create(:student_with_many_activities),
              FactoryBot.create(:student_with_many_activities),
              FactoryBot.create(:student_with_many_activities),
              FactoryBot.create(:student_with_many_activities),
              FactoryBot.create(:student_with_many_activities),
              FactoryBot.create(:student_with_many_activities),
              FactoryBot.create(:student_with_many_activities)
            ])
           ]
         }
      end

    end

    factory :student do
      role 'student'
      classrooms { [ FactoryBot.create(:classroom) ] }
    end

    factory :student_with_many_activities do
      role 'student'
      classrooms { [ FactoryBot.create(:classroom) ] }

      transient do
        activity_count 5
      end

      after(:create) do |user, evaluator|
        create_list(:activity_session, evaluator.activity_count, user: user)
      end
    end


    factory :student_with_one_activity do
      role 'student'
      classrooms { [ FactoryBot.create(:classroom) ] }


      after(:create) do |user, evaluator|
        create_list(:activity_session, 1, user: user)
      end
    end

    factory :student_with_one_assigned_activity do
      role 'student'
      classrooms { [ FactoryBot.create(:classroom_with_one_student) ] }

      after(:create) do |user, evaluator|
        create_list(:classroom_activity, 1, assigned_student_ids: [user.id], classroom: user.classrooms.first)
      end
    end

  end
end
