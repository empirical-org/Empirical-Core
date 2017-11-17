FactoryBot.define do
  factory :classroom_activity do
    to_create {|instance| instance.save(validate: false) }
    unit {Unit.first || FactoryBot.create(:unit)}
    classroom {Classroom.first || FactoryBot.create(:classroom)}
    assign_on_join false
    activity {FactoryBot.create(:activity, :production)}
	  factory :classroom_activity_with_activity do
	  	activity { Activity.first || FactoryBot.create(:activity) }
	  end

    factory :classroom_activity_with_activity_sessions do
      after(:create) do |ca|
        create_list(:activity_session, 5,  classroom_activity: ca)
      end
    end

    trait :diagnostic do
      activity { create(:diagnostic_activity, :production) }
    end

    trait :proofreader do
      activity { create(:proofreader_activity, :production) }
    end

    trait :grammar do
      activity { create(:grammar_activity, :production) }
    end

    trait :connect do
      activity { create(:connect_activity, :production) }
    end

    trait :lesson do
      activity { create(:lesson_activity, :production) }
    end
  end
end
