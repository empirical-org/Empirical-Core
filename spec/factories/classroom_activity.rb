FactoryBot.define do
  factory :classroom_activity do
    unit            { create(:unit) }
    classroom       { create(:classroom) }
    assign_on_join  false
    activity        { create(:activity, :production) }

	  factory :classroom_activity_with_activity do
	     activity { Activity.first || create(:activity) }
	  end

    factory :classroom_activity_with_activity_sessions do
      after(:create) do |ca|
        create_list(:activity_session, 5,  classroom_activity: ca)
      end
    end

    factory :lesson_classroom_activity_with_activity_sessions do
       activity { create(:lesson_activity, :with_follow_up) }
       after(:create) do |ca|
         create_list(:activity_session, 5, classroom_activity: ca)
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
