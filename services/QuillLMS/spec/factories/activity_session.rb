FactoryBot.define do
  factory :simple_activity_session, class: 'ActivitySession' do; end

  factory :activity_session do
    activity            { create(:activity, :production) }
    uid                 { SecureRandom.urlsafe_base64 }
    percentage          { 0.50 }
    started_at          { created_at }
    state               'finished'
    completed_at        { Time.now }
    is_final_score      true
    is_retry            false
    temporary           false
    visible             true

    before(:create) do |activity_session|
      if activity_session.user && !activity_session.classroom_unit
        activity_session.classroom_unit = create(:classroom_unit, assigned_student_ids: [activity_session.user.id])
      elsif activity_session.user && activity_session.classroom_unit && activity_session.classroom_unit.assigned_student_ids.empty?
        activity_session.classroom_unit.update(assigned_student_ids: [activity_session.user.id])
      elsif activity_session.classroom_unit && !activity_session.user
        student = create(:student, last_active: Time.new(2020, 1, 1))
        activity_session.user = student
        activity_session.classroom_unit.update(assigned_student_ids: [activity_session.user.id])
      elsif !activity_session.user && !activity_session.classroom_unit
        student = create(:student, last_active: Time.new(2020, 1, 1))
        activity_session.user = student
        activity_session.classroom_unit = create(:classroom_unit, assigned_student_ids: [student.id])
      end
    end

    after(:create) do |activity_session|
      classroom_unit = activity_session.classroom_unit
      UnitActivity.find_or_create_by(activity: activity_session.activity, unit_id: classroom_unit.unit_id)
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

    trait :started do
      percentage {nil}
      state 'started'
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

    factory :activity_session_without_concept_results do
      after(:create) do |activity_session|
          ConceptResult.where(activity_session: activity_session).destroy_all
      end
    end
  end
end
