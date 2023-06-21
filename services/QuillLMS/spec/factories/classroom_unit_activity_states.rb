# frozen_string_literal: true

# == Schema Information
#
# Table name: classroom_unit_activity_states
#
#  id                :integer          not null, primary key
#  completed         :boolean          default(FALSE)
#  data              :json
#  locked            :boolean          default(FALSE)
#  pinned            :boolean          default(FALSE)
#  created_at        :datetime
#  updated_at        :datetime
#  classroom_unit_id :integer          not null
#  unit_activity_id  :integer          not null
#
# Indexes
#
#  index_classroom_unit_activity_states_on_classroom_unit_id  (classroom_unit_id)
#  index_classroom_unit_activity_states_on_unit_activity_id   (unit_activity_id)
#  unique_classroom_and_activity_for_cua_state                (classroom_unit_id,unit_activity_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (classroom_unit_id => classroom_units.id)
#  fk_rails_...  (unit_activity_id => unit_activities.id)
#
FactoryBot.define do
  factory :classroom_unit_activity_state do
    unit_activity            { create(:unit_activity) }
    classroom_unit       { create(:classroom_unit) }
    pinned  false
    locked  false
    completed false
  end
end
