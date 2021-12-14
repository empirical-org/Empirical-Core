# frozen_string_literal: true

# == Schema Information
#
# Table name: classrooms
#
#  id                  :integer          not null, primary key
#  code                :string
#  grade               :string
#  grade_level         :integer
#  name                :string
#  synced_name         :string
#  visible             :boolean          default(TRUE), not null
#  created_at          :datetime
#  updated_at          :datetime
#  clever_id           :string
#  google_classroom_id :bigint
#  teacher_id          :integer
#
# Indexes
#
#  index_classrooms_on_clever_id            (clever_id)
#  index_classrooms_on_code                 (code)
#  index_classrooms_on_google_classroom_id  (google_classroom_id)
#  index_classrooms_on_grade                (grade)
#  index_classrooms_on_grade_level          (grade_level)
#  index_classrooms_on_teacher_id           (teacher_id)
#
FactoryBot.define do
  factory :simple_classroom, class: Classroom do
    name 'a'
  end

  factory :classroom do
    name  { "#{['Period', 'Block', 'Class', 'Classroom'].sample} #{(1..100).to_a.sample}#{('A'..'Z').to_a.sample}" }
    grade { [(1..12).to_a, 'University', 'Kindergarten'].flatten.sample.to_s }

    trait :from_google do
      google_classroom_id { (1..10).map { (1..9).to_a.sample }.join } # mock a google id
    end

    trait :from_clever do
      clever_id { (1..24).map { (('a'..'f').to_a + (1..9).to_a).sample }.join } # mock a clever id
    end

    factory :classroom_with_a_couple_students do
      students { create_pair(:student) }
    end

    factory :classroom_with_one_student do
      students { create_list(:student, 1) }
    end

    factory :classroom_with_students_and_activities do
      students { create_list(:student_with_many_activities, 2) }
    end

    factory :classroom_with_classroom_units do
      after(:create) do |classroom|
        create_list(:classroom_unit_with_activity_sessions, 2, classroom: classroom)
      end
    end

    factory :classroom_with_3_classroom_units do
      after(:create) do |classroom|
        create_list(:classroom_unit_with_activity_sessions, 3, classroom: classroom)
      end
    end

    factory :classroom_with_lesson_classroom_units do
      after(:create) do |classroom|
        create_list(:lesson_classroom_unit_with_activity_sessions, 2, classroom: classroom)
      end
    end

    factory :google_classroom_with_a_couple_google_students do
      from_google
      students { create_pair(:student, :signed_up_with_google)}
    end

    factory :clever_classroom_with_a_couple_clever_students do
      from_clever
      students { create_pair(:student, :signed_up_with_clever)}
    end

    trait :with_no_teacher do
      after(:create) do |classroom|
        ClassroomsTeacher.where(classroom: classroom).delete_all
      end
    end

    trait :with_coteacher do
      after(:create) do |classroom|
        create(:classrooms_teacher, classroom: classroom, user: create(:teacher), role: 'coteacher')
      end
    end

    trait :with_a_couple_coteachers do
      after(:create) do |classroom|
        create(:classrooms_teacher, classroom: classroom, user: create(:teacher), role: 'coteacher')
        create(:classrooms_teacher, classroom: classroom, user: create(:teacher), role: 'coteacher')
      end
    end

    trait :archived do
      visible false
    end

    after(:create) do |classroom|
      if classroom.classrooms_teachers.none?
        create(:classrooms_teacher, classroom: classroom, user: create(:teacher))
      end
    end
  end

end
