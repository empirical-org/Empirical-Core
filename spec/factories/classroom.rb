FactoryBot.define do
  factory :classroom do
    name  { " Classroom'" }
    grade { [(1..12).to_a, 'University', 'Kindergarten', 'Other'].flatten.sample.to_s }
    #
    # trait :from_google do
    #   google_classroom_id { (1..10).map { (1..9).to_a.sample }.join } # mock a google id
    # end
    #
    # trait :from_clever do
    #   clever_id { (1..24).map { (('a'..'f').to_a + (1..9).to_a).sample }.join } # mock a clever id
    # end

    factory :classroom_with_a_couple_students do
      students { create_pair(:student) }
    end

    factory :classroom_with_one_student do
      students { create_list(:student, 1) }
    end

    factory :classroom_with_students_and_activities do
      students { create_list(:student_with_many_activities, 5) }
    end
    
    factory :classroom_with_classroom_activities do
      after(:create) do |classroom|
        create_list(:classroom_activity_with_activity_sessions, 5, classroom: classroom)
      end
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

    after(:create) do |classroom|
      if classroom.classrooms_teachers.none?
        create(:classrooms_teacher, classroom: classroom, user: create(:teacher))
      end
    end
  end
end
