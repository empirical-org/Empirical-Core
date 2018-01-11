FactoryBot.define do
  factory :activity_session do
    activity            { create(:activity, :production) }
    classroom_activity  { create(:classroom_activity, activity: activity) }
    user                { create(:student) }
    uid                 { SecureRandom.urlsafe_base64 }
    percentage          { Faker::Number.decimal(0, 2) }
    started_at          { created_at }
    state               'finished'
    completed_at        { Faker::Time.backward(30) } # random time in past month
    is_final_score      true
    is_retry            false
    temporary           false

    after(:create) do |activity_session|
      unless activity_session.classroom_activity.nil?
        classroom_activity = activity_session.classroom_activity
      else # we'll do it live
        classroom_activity = create(:classroom_activity, activity: activity_session.activity)
      end
      StudentsClassrooms.find_or_create_by(student_id: activity_session.user_id, classroom_id: classroom_activity.classroom_id )
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
