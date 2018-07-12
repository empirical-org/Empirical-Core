FactoryBot.define do
  factory :activity_session do
    activity            { create(:activity, :production) }
    uid                 { SecureRandom.urlsafe_base64 }
    percentage          { Faker::Number.decimal(0, 2) }
    started_at          { created_at }
    state               'finished'
    completed_at        { Faker::Time.backward(30) } # random time in past month
    is_final_score      true
    is_retry            false
    temporary           false

    before(:create) do |activity_session|
      student = create(:student)
      activity_session.user = student
      activity_session.classroom_unit = create(:classroom_unit, assigned_student_ids: [student.id])
    end

    after(:create) do |activity_session|
      unless activity_session.classroom_unit.nil?
        classroom_unit = activity_session.classroom_unit
      else # we'll do it live
        classroom_unit = create(:classroom_unit)
        create(:unit_activity, activity: activity_session.activity, unit: classroom_unit.unit)
      end
      StudentsClassrooms.find_or_create_by(student_id: activity_session.user_id, classroom_id: classroom_unit.classroom_id )
      create(:concept_result, activity_session: activity_session)
    end

    trait :retry do
      is_retry true
    end

    trait :unstarted do
      percentage {nil}
      state 'unstarted'
      completed_at {nil}
      is_final_score false
    end

    factory :diagnostic_activity_session do
      activity { create(:diagnostic_activity) }
    end

    factory :proofreader_activity_session do
      activity { create(:proofreader_activity) }
    end

    factory :grammar_activity_session do
      activity { create(:grammar_activity) }
    end

    factory :connect_activity_session do
      activity { create(:connect_activity) }
    end

    factory :lesson_activity_session do
      activity { create(:lesson_activity) }
    end
  end
end
