# frozen_string_literal: true

FactoryBot.define do
  factory :unit_activity do
    unit
    activity { create(:activity, :production) }

    factory :unit_activity_with_activity do
      activity { Activity.first || create(:activity) }
    end

    trait :diagnostic_unit_activity do
      activity { create(:diagnostic_activity, :production) }
    end

    trait :proofreader_unit_activity do
      activity { create(:proofreader_activity, :production) }
    end

    trait :grammar_unit_activity do
      activity { create(:grammar_activity, :production) }
    end

    trait :connect_unit_activity do
      activity { create(:connect_activity, :production) }
    end

    trait :lesson_unit_activity do
      activity { create(:lesson_activity, :production, :with_follow_up) }
    end

    trait :evidence_unit_activity do
      activity { create(:evidence_activity, :production) }
    end
  end
end
