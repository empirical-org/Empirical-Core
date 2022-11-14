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
class ClassroomUnitActivityState < ApplicationRecord
  include LessonsCache

  class DuplicateClassroomUnitActivityStateError < StandardError; end

  belongs_to :classroom_unit, touch: true
  belongs_to :unit_activity

  before_validation :handle_pinning

  after_create :lock_if_lesson
  after_save :update_lessons_cache_with_data

  validate :not_duplicate, :only_one_pinned

  def visible
    classroom_unit.visible && unit_activity.visible
  end

  def update_lessons_cache_with_data
    update_lessons_cache(self)
  end


  private def lock_if_lesson
    return unless unit_activity.activity.lesson?

    update(locked: true)
  end

  private def not_duplicate
    cua = ClassroomUnitActivityState.unscoped.find_by(
      classroom_unit_id: classroom_unit_id,
      unit_activity_id: unit_activity_id
    )

    if cua && (cua.id != id)
      ErrorNotifier.report(
        DuplicateClassroomUnitActivityStateError.new,
        classroom_unit_id: classroom_unit_id,
        unit_activity_id: unit_activity_id
      )
      errors.add(:duplicate_classroom_unit_activity_state, "this classroom unit activity state is a duplicate")
    else
      true
    end
  end

  private def handle_pinning
    return unless pinned

    # unpin ca before archiving
    if visible == false
      update!(pinned: false)
    else
      # unpin any other pinned ca before pinning new one
      classroom = classroom_unit.classroom
      classroom_unit_ids = classroom.classroom_units.ids.flatten
      pinned_cua = ClassroomUnitActivityState.unscoped.find_by(pinned: true, classroom_unit_id: classroom_unit_ids)
      return if pinned_cua && pinned_cua == self

      pinned_cua.update_column("pinned", false) if pinned_cua
    end
  end

  private def only_one_pinned
    if pinned
      classroom = classroom_unit.classroom
      classroom_unit_ids = classroom.classroom_units.ids.flatten
      pinned_cuas = ClassroomUnitActivityState.unscoped.where(pinned: true, classroom_unit_id: classroom_unit_ids)
      pinned_cuas.length == 1
    end
    true
  end

end
