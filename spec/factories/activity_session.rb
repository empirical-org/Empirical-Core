FactoryBot.define do
  factory :activity_session do
    activity            { FactoryBot.create(:activity, :production) }
    classroom_activity  { FactoryBot.create(:classroom_activity, activity: activity) }
    user                { FactoryBot.create(:student) }
    uid                 { SecureRandom.urlsafe_base64 }
    percentage          { Faker::Number.decimal(0, 2).to_d }
    started_at          { created_at }
    state               'finished'
    completed_at        { Faker::Time.backward(365) } # random time in past year
    is_final_score      true
    is_retry            false
    temporary           false

    after(:create) do |activity_session|
      StudentsClassrooms.find_or_create_by(student_id: activity_session.user.id, classroom_id: activity_session.classroom_activity.classroom.id )
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
      activity { FactoryBot.create(:diagnostic_activity) }
    end

    factory :proofreader_activity_session do
      activity { FactoryBot.create(:proofreader_activity) }
    end

    factory :grammar_activity_session do
      activity { FactoryBot.create(:grammar_activity) }
    end

    factory :connect_activity_session do
      activity { FactoryBot.create(:connect_activity) }
    end

    factory :lesson_activity_session do
      activity { FactoryBot.create(:lesson_activity) }
    end
  end
end
