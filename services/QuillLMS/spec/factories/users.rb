# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                    :integer          not null, primary key
#  account_type          :string           default("unknown")
#  active                :boolean          default(FALSE)
#  classcode             :string
#  email                 :string
#  flags                 :string           default([]), not null, is an Array
#  flagset               :string           default("production"), not null
#  ip_address            :inet
#  last_active           :datetime
#  last_sign_in          :datetime
#  name                  :string
#  password_digest       :string
#  role                  :string           default("user")
#  send_newsletter       :boolean          default(FALSE)
#  signed_up_with_google :boolean          default(FALSE)
#  time_zone             :string
#  title                 :string
#  token                 :string
#  username              :string
#  created_at            :datetime
#  updated_at            :datetime
#  clever_id             :string
#  google_id             :string
#  stripe_customer_id    :string
#
# Indexes
#
#  email_idx                          (email) USING gin
#  index_users_on_active              (active)
#  index_users_on_classcode           (classcode)
#  index_users_on_clever_id           (clever_id)
#  index_users_on_email               (email)
#  index_users_on_google_id           (google_id)
#  index_users_on_role                (role)
#  index_users_on_stripe_customer_id  (stripe_customer_id)
#  index_users_on_time_zone           (time_zone)
#  index_users_on_token               (token)
#  index_users_on_username            (username)
#  name_idx                           (name) USING gin
#  unique_index_users_on_clever_id    (clever_id) UNIQUE WHERE ((clever_id IS NOT NULL) AND ((clever_id)::text <> ''::text) AND ((id > 5593155) OR ((role)::text = 'student'::text)))
#  unique_index_users_on_email        (email) UNIQUE WHERE ((id > 1641954) AND (email IS NOT NULL) AND ((email)::text <> ''::text))
#  unique_index_users_on_google_id    (google_id) UNIQUE WHERE ((id > 1641954) AND (google_id IS NOT NULL) AND ((google_id)::text <> ''::text))
#  unique_index_users_on_username     (username) UNIQUE WHERE ((id > 1641954) AND (username IS NOT NULL) AND ((username)::text <> ''::text))
#  username_idx                       (username) USING gin
#  users_to_tsvector_idx              (to_tsvector('english'::regconfig, (name)::text)) USING gin
#  users_to_tsvector_idx1             (to_tsvector('english'::regconfig, (email)::text)) USING gin
#  users_to_tsvector_idx2             (to_tsvector('english'::regconfig, (role)::text)) USING gin
#  users_to_tsvector_idx3             (to_tsvector('english'::regconfig, (classcode)::text)) USING gin
#  users_to_tsvector_idx4             (to_tsvector('english'::regconfig, (username)::text)) USING gin
#  users_to_tsvector_idx5             (to_tsvector('english'::regconfig, split_part((ip_address)::text, '/'::text, 1))) USING gin
#
FactoryBot.define do
  factory :simple_user, class: 'User' do
    sequence(:id) { |n| n + User::UNIQUENESS_CONSTRAINT_MINIMUM_ID }
    name 'Jane Doe'
    email 'fake@example.com'
    password 'password'
    time_zone 'UTC'
  end

  factory :user do
    sequence(:id) { |n| n + User::UNIQUENESS_CONSTRAINT_MINIMUM_ID }
    sequence(:name) { |n| "FirstName LastName #{n}" }
    username   { name.gsub(' ', '-') }
    password   { "password" }
    email      { "#{name.gsub(' ', '.').downcase}@fake-email.com" }
    ip_address { "192.168.0.0" }
    flagset    { 'production' }
    time_zone 'UTC'

    factory :staff do
      role 'staff'
    end

    factory :teacher do
      role 'teacher'

      factory :teacher_with_one_classroom do
        after(:create) do |teacher|
          create(:classrooms_teacher, user_id: teacher.id)
        end
      end

      factory :teacher_with_school do
        after(:create) do |teacher|
          school = create(:school)
          school.users.push(teacher)
        end
      end

      factory :co_teacher_with_one_classroom do
        after(:create) do |teacher|
          create(:classrooms_teacher, user_id: teacher.id, role: 'coteacher')
        end
      end

      factory :teacher_with_a_couple_classrooms_with_a_couple_students_each do
        after(:create) do |teacher|
          classrooms = create_pair(:classroom_with_a_couple_students, :with_no_teacher)
          classrooms.each do |classroom|
            create(:classrooms_teacher, user: teacher, classroom: classroom, role: 'owner')
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
          unit1 = create(:unit, user_id: teacher.id, name: 'Unit A')
          unit2 = create(:unit, user_id: teacher.id, name: 'Unit B')
          unit3 = create(:unit, user_id: teacher.id, name: 'Unit C')

          activities = create_list(:activity, 9, :production)
          classrooms = create_pair(:classroom, :with_no_teacher)
          classrooms.each do |c|
            create(:classrooms_teacher, classroom_id: c.id, user_id: teacher.id)
            students = create_list(:student, 3)
            activities.each_with_index do |a, i|
              if i < 3
                unless UnitActivity.find_by(unit: unit1, activity: a)
                  create(:unit_activity, unit: unit1, activity: a)
                end
                unless ClassroomUnit.find_by(unit: unit1, classroom: c)
                  create(:classroom_unit, unit: unit1, classroom: c, assigned_student_ids: students.map { |s| s[:id]})
                end
              elsif i < 6
                unless UnitActivity.find_by(unit: unit2, activity: a)
                  create(:unit_activity, unit: unit2, activity: a)
                end
                unless ClassroomUnit.find_by(unit: unit2, classroom: c)
                  create(:classroom_unit, unit: unit2, classroom: c, assigned_student_ids: students.map { |s| s[:id]})
                end
              else
                unless UnitActivity.find_by(unit: unit3, activity: a)
                  create(:unit_activity, unit: unit3, activity: a)
                end
                unless ClassroomUnit.find_by(unit: unit3, classroom: c)
                  create(:classroom_unit, unit: unit3, classroom: c, assigned_student_ids: students.map { |s| s[:id]})
                end
              end
            end
            students.each do |s|
              create(:students_classrooms, student: s, classroom: c)
            end
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
        password { name.to_s.split[-1] }
      end

      factory :student_in_two_classrooms_with_many_activities do
        after(:create) do |student|
          classrooms = create_pair(:classroom, students: [student])
          classrooms.each do |classroom|
            units = create_pair(:unit, user: classroom.owner)
            units.each do |unit|
              unit_activity = create(:unit_activity, unit: unit)
              classroom_unit = create(:classroom_unit, unit: unit, classroom: classroom, assigned_student_ids: [student.id])
              create(:activity_session, classroom_unit: classroom_unit, user: student, activity: unit_activity.activity)
            end
          end
        end
      end
    end
  end
end
