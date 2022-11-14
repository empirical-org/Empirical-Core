# frozen_string_literal: true

# == Schema Information
#
# Table name: students_classrooms
#
#  id           :integer          not null, primary key
#  visible      :boolean          default(TRUE), not null
#  created_at   :datetime
#  updated_at   :datetime
#  classroom_id :integer
#  student_id   :integer
#
# Indexes
#
#  index_students_classrooms_on_classroom_id                 (classroom_id)
#  index_students_classrooms_on_student_id                   (student_id)
#  index_students_classrooms_on_student_id_and_classroom_id  (student_id,classroom_id) UNIQUE
#
class StudentsClassrooms < ApplicationRecord
  include Archivable
  include CheckboxCallback

  belongs_to :student, class_name: "User"
  belongs_to :classroom, class_name: "Classroom", touch: true

  # validates uniqueness of student/classroom on db
  after_save :checkbox, :run_associator

  after_save :archive_student_associations_for_classroom,
    if: proc { |sc| sc.archived? && sc.student && sc.classroom },
    unless: :skip_archive_student_associations

  after_save :save_user_pack_sequence_items, if: [:saved_change_to_visible?]

  after_commit :invalidate_classroom_minis

  default_scope { where(visible: true) }

  attr_accessor :skip_archive_student_associations

  def archived_classrooms_manager
    {
      className: classroom.name,
      id: id,
      joinDate: created_at.strftime("%m/%d/%Y"),
      teacherName: classroom.owner.name
    }
  end

  def archive_student_associations_for_classroom
    return if skip_archive_student_associations

    ArchiveStudentAssociationsForClassroomWorker.perform_async(student_id, classroom_id)
  end

  private def run_associator
    return unless student && classroom && visible

    Associators::StudentsToClassrooms.run(student, classroom)
  end

  private def checkbox
    return unless classroom

    find_or_create_checkbox(Objective::ADD_STUDENTS, classroom.owner)
  end

  private def invalidate_classroom_minis
    return unless classroom&.owner.present?

    $redis.del("user_id:#{classroom.owner.id}_classroom_minis")
  end

  private def save_user_pack_sequence_items
    SaveUserPackSequenceItemsWorker.perform_async(classroom_id, student_id)
  end
end
