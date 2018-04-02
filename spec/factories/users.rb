FactoryBot.define do
  factory :user do
    name       { "#{Faker::Name.unique.first_name} #{Faker::Name.last_name}" }
    username   { name.gsub(' ', '-') }
    password   { Faker::Internet.password }
    email      { Faker::Internet.safe_email(name.gsub(' ', '.')) }
    ip_address { Faker::Internet.public_ip_v4_address }

    factory :staff do
      role 'staff'
    end

    factory :admin do
      role 'admin'
    end

    factory :teacher do
      role 'teacher'

      factory :teacher_with_one_classroom do
        after(:create) do |teacher|
          create(:classrooms_teacher, user_id: teacher.id)
        end
      end

      factory :teacher_with_a_couple_classrooms_with_a_couple_students_each do
        after(:create) do |teacher|
          classrooms = create_pair(:classroom_with_a_couple_students, :with_no_teacher)
          classrooms.each do |classroom|
            create(:classrooms_teacher, user_id: teacher.id, classroom: classroom, role: 'owner')
          end
        end
      end

      factory :teacher_with_a_couple_classrooms_with_one_student_each do
        after(:create) do |teacher|
          classrooms = create_pair(:classroom_with_one_student, :with_no_teacher)
          classrooms.each do |classroom|
            create(:classrooms_teacher, user_id: teacher.id, classroom: classroom, role: 'owner')
          end
        end
      end

      factory :teacher_with_a_couple_active_and_archived_classrooms do
        after(:create) do |teacher|
          classrooms = create_pair(:classroom, :with_no_teacher)
          archived_classrooms = create_pair(:classroom, :with_no_teacher, :archived)
          (classrooms + archived_classrooms).each do |classroom|
            create(:classrooms_teacher, user_id: teacher.id, classroom: classroom)
          end
        end
      end

      trait :has_a_stripe_customer_id do
        stripe_customer_id 'fake_stripe_id'
      end

      trait :signed_up_with_google do
        signed_up_with_google true
        google_id { (1..21).map{(1..9).to_a.sample}.join } # mock a google id
        password { nil }
        username { nil }
      end

      trait :signed_up_with_clever do
        password { nil }
        username { nil }
        clever_id { (1..24).map{(('a'..'f').to_a + (1..9).to_a).sample}.join } # mock a clever id
      end

      trait :with_classrooms_students_and_activities do
        after(:create) do |teacher|
           classrooms = create_pair(:classroom_with_students_and_activities, :with_no_teacher)
           classrooms.each do |classroom|
             create(:classrooms_teacher, user_id: teacher.id, classroom: classroom)
           end
        end
      end

      trait :premium do
        after(:create) do |teacher|
          create(:user_subscription, user_id: teacher.id)
        end
      end
    end

    factory :student do
      role 'student'

      trait :signed_up_with_google do
        signed_up_with_google true
        google_id { (1..21).map{(1..9).to_a.sample}.join }
        password { nil }
        username { "#{name}@student" }
      end

      trait :signed_up_with_clever do
        password { nil }
        username { "#{name}@student" }
        clever_id { (1..24).map{(('a'..'f').to_a + (1..9).to_a).sample}.join } # mock a clever id
      end

      trait :in_one_classroom do
        classrooms { [FactoryBot.create(:classroom)] }
      end

      factory :student_with_many_activities do
        classrooms { [FactoryBot.create(:classroom)] }
        transient do
          activity_count 5
        end
        after(:create) do |user, evaluator|
          create_list(:activity_session, evaluator.activity_count, user: user)
        end
      end

      trait :with_generated_password do
        password { name.to_s.split("\s")[-1] }
      end

      factory :student_in_two_classrooms_with_many_activities do
        after(:create) do |student|
          classrooms = create_pair(:classroom, students: [student])
          classrooms.each do |classroom|
            units = create_pair(:unit, user: classroom.owner)
            units.each do |unit|
              classroom_activities = create_pair(:classroom_activity, unit: unit, classroom: classroom, assigned_student_ids: [student.id])
              create(:activity_session, classroom_activity: classroom_activities.first, user: student, activity: classroom_activities.first.activity)
            end
          end
        end
      end
    end
  end
end
