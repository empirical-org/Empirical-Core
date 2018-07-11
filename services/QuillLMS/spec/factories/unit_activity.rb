FactoryBot.define do
  factory :unit_activity do
    unit            { create(:unit) }
    activity        { create(:activity, :production) }
    visible true

	  factory :unit_activity_with_activity do
	     activity { Activity.first || create(:activity) }
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
