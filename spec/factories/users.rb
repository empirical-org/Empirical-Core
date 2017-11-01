# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  sequence(:name) { |i| "Firstname Lastname#{i}" }
  sequence(:username) { |i| "Username#{i}" }
  sequence(:key) { |i| "key-#{i}" }
  sequence(:description) { |i| "Description #{i}" }
  sequence(:email) { |n| "user#{n}@example.com" }

  factory :user do

    name 'Test User'
    role 'user'
    password '123456'
    sequence(:email) {|n| "user#{n}@gmail.com"}
    sequence(:username) {|n| "username_is#{n}"}

    factory :staff do
      role 'staff'
    end

    factory :admin do
      role 'admin'
    end

    factory :teacher do
      role 'teacher'

      factory :mr_kotter do
        name                  'Gabe Kotter'
        username              'mrkotter'
        email                 'gabe.kotter@jamesbuchananhigh.edu'
        password              'sweathogs'
      end

      factory :mr_woodman do
        name 'Michael Woodman'
      end

      factory :teacher_with_students do
        classrooms_i_teach { [ FactoryBot.create(:classroom, students: [FactoryBot.create(:student)]),
                       FactoryBot.create(:classroom, students: [FactoryBot.create(:student)])
           ] }
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
      username
      classrooms { [ FactoryBot.create(:classroom) ] }

      factory :arnold_horshack do
        name                  'Arnold Horshack'
        username              'horshack'
        password              'dingfelder'
        email                 'ahorshack@coldmail.com'
      end

      factory :vinnie_barbarino do
        name                  'Vinnie Barbarino'
        username              'vinnie_barbarino'
        password              'sally'
        email                 'vinnieb@geemail.com'
      end
    end

    factory :student_with_many_activities do
      role 'student'
      username
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
      username
      classrooms { [ FactoryBot.create(:classroom) ] }


      after(:create) do |user, evaluator|
        create_list(:activity_session, 1, user: user)
      end
    end

    factory :student_with_one_assigned_activity do
      role 'student'
      username
      classrooms { [ FactoryBot.create(:classroom_with_one_student) ] }

      after(:create) do |user, evaluator|
        create_list(:classroom_activity, 1, assigned_student_ids: [user.id], classroom: user.classrooms.first)
      end
    end

  end
end
