# frozen_string_literal: true

# == Schema Information
#
# Table name: classroom_units
#
#  id                   :integer          not null, primary key
#  assign_on_join       :boolean          default(FALSE)
#  assigned_student_ids :integer          default([]), is an Array
#  visible              :boolean          default(TRUE)
#  created_at           :datetime
#  updated_at           :datetime
#  classroom_id         :integer          not null
#  unit_id              :integer          not null
#
# Indexes
#
#  index_classroom_units_on_classroom_id              (classroom_id)
#  index_classroom_units_on_unit_id                   (unit_id)
#  index_classroom_units_on_unit_id_and_classroom_id  (unit_id,classroom_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (classroom_id => classrooms.id)
#  fk_rails_...  (unit_id => units.id)
#
FactoryBot.define do
  factory :classroom_unit do
    unit            { create(:unit) }
    classroom       { create(:classroom) }
    assign_on_join  false

    factory :classroom_unit_with_activity_sessions do
      after(:create) do |classroom_unit|
        unit_activity = create(:unit_activity, unit: classroom_unit.unit)
        create(:activity_session, percentage: 19, classroom_unit_id: classroom_unit.id, activity: unit_activity.activity)
        create(:activity_session, percentage: 21, classroom_unit_id: classroom_unit.id, activity: unit_activity.activity)
      end
    end

    factory :lesson_classroom_unit_with_activity_sessions do
      after(:create) do |classroom_unit|
        unit_activity = create(:lesson_unit_activity, unit: classroom_unit.unit)
        create_list(:activity_session, 2, classroom_unit: classroom_unit, activity: unit_activity.activity)
      end
    end
  end
end
