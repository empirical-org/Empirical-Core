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
class ClassroomUnit < ApplicationRecord
  include Archivable
  include AtomicArrays

  belongs_to :unit # Note, there is a touch in the unit -> classroom_unit direction, so don't add one here.
  belongs_to :unit_unscoped, foreign_key: :unit_id
  belongs_to :classroom
  belongs_to :classroom_unscoped, foreign_key: :classroom_id

  has_many :activity_sessions
  has_many :unit_activities, through: :unit
  has_many :pack_sequence_items, dependent: :destroy
  has_many :user_pack_sequence_items, through: :pack_sequence_items
  has_many :completed_activity_sessions, -> { completed }, class_name: 'ActivitySession'
  has_many :classroom_unit_activity_states, dependent: :destroy

  scope :visible, -> { where(visible: true) }

  validates :unit, uniqueness: { scope: :classroom }

  before_save :check_for_assign_on_join_and_update_students_array_if_true

  after_save :manage_user_pack_sequence_items, if: :saved_change_to_assigned_student_ids?
  after_save :assign_student_learning_sequences, if: :saved_change_to_assigned_student_ids?
  after_save :hide_appropriate_activity_sessions, :save_user_pack_sequence_items

  # Using an after_commit hook here because we want to trigger the callback
  # on save or touch, and touch explicitly bypasses after_save hooks
  after_commit :touch_classroom_without_callbacks

  def assigned_students
    User.where(id: assigned_student_ids)
  end

  def validate_assigned_student(student_id)
    if assign_on_join
      if !assigned_student_ids || assigned_student_ids.exclude?(student_id)
        if !assigned_student_ids.is_a?(Array)
          update(assigned_student_ids: [])
        end
        update(assigned_student_ids: StudentsClassrooms.where(classroom_id: classroom_id).pluck(:student_id))
      end
      true
    else
      assigned_student_ids && assigned_student_ids.include?(student_id)
    end
  end

  def teacher_and_classroom_name
    { teacher: classroom&.owner&.name, classroom: classroom&.name }
  end

  def remove_assigned_student(student_id)
    new_assigned_student_ids = assigned_student_ids - [student_id]
    # we need to set assign_on_join to false so that the student doesn't get added back
    # in by the #check_for_assign_on_join_and_update_students_array_if_true method.
    # if assign on join should still be true the aforementioned method will set it.
    update(assigned_student_ids: new_assigned_student_ids, assign_on_join: false)
  end

  def manage_user_pack_sequence_items
    pack_sequence_items.reload.each do |pack_sequence_item|
      existing_user_ids = pack_sequence_item.reload.users.pluck(:id)
      new_user_ids = assigned_student_ids - existing_user_ids
      deleted_user_ids = existing_user_ids - assigned_student_ids

      new_user_ids.each do |user_id|
        UserPackSequenceItem.find_or_create_by!(pack_sequence_item_id: pack_sequence_item.id, user_id: user_id)
      rescue ActiveRecord::RecordNotUnique
        next
      end

      pack_sequence_item
        .user_pack_sequence_items
        .where(user_id: deleted_user_ids)
        .destroy_all
    end
  end

  def save_user_pack_sequence_items
    assigned_student_ids.each { |user_id| SaveUserPackSequenceItemsWorker.perform_async(classroom_id, user_id) }
  end

  private def hide_unassigned_activity_sessions
    # validate or hides any other related activity sessions
    return unless activity_sessions.present?

    activity_sessions.each do |as|
      # We are explicitly checking to ensure that the student here actually belongs
      # in this classroom before running the validate_assigned_student method because
      # if this is not true, validate_assigned_student starts an infinite loop!
      if !StudentsClassrooms.find_by(classroom_id: classroom_id, student_id: as.user_id) || !validate_assigned_student(as.user_id)
        as.update(visible: false)
      end
    end
  end

  private def hide_all_activity_sessions
    activity_sessions.update_all(visible: false, updated_at: DateTime.current)
  end

  private def hide_appropriate_activity_sessions
    visible ? hide_unassigned_activity_sessions : hide_all_activity_sessions
  end

  private def check_for_assign_on_join_and_update_students_array_if_true
    student_ids = StudentsClassrooms.where(classroom_id: classroom_id).pluck(:student_id)

    if assigned_student_ids&.any? &&
       !assign_on_join &&
       assigned_student_ids.length >= student_ids.length &&
       (assigned_student_ids - student_ids).empty?

      # then it should indeed be assigned to all
      self.assign_on_join = true
    end

    return unless assign_on_join

    # then we ensure that it has all the student ids
    self.assigned_student_ids = student_ids
  end

  private def touch_classroom_without_callbacks
    classroom&.update_columns(updated_at: current_time_from_proper_timezone) unless classroom&.destroyed?
  end

  private def assign_student_learning_sequences
    old_ids, new_ids = saved_change_to_assigned_student_ids
    newly_assigned = new_ids - old_ids
    newly_assigned.each do |student_id|
      StudentLearningSequences::HandleAssignmentWorker.perform_async(id, student_id)
    end
  end
end
