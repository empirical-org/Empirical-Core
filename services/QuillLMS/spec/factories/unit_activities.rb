# frozen_string_literal: true

# == Schema Information
#
# Table name: unit_activities
#
#  id           :integer          not null, primary key
#  due_date     :datetime
#  order_number :integer
#  publish_date :datetime
#  visible      :boolean          default(TRUE)
#  created_at   :datetime
#  updated_at   :datetime
#  activity_id  :integer          not null
#  unit_id      :integer          not null
#
# Indexes
#
#  index_unit_activities_on_activity_id              (activity_id)
#  index_unit_activities_on_unit_id                  (unit_id)
#  index_unit_activities_on_unit_id_and_activity_id  (unit_id,activity_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activities.id)
#  fk_rails_...  (unit_id => units.id)
#
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
