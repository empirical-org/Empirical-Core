# frozen_string_literal: true

class StudentClassroomAssociator < ApplicationService
  attr_reader :student, :classroom

  def initialize(student, classroom)
    @student = student
    @classroom = classroom
  end

  def run
    return student unless valid_student? && valid_classroom?

    classroom.touch
    associate_student_to_classroom
    student.reload
  end

  private def associate_student_to_classroom
    student_classroom = StudentsClassrooms.unscoped.find_or_create_by!(student: student, classroom: classroom)

    if student_classroom.previously_new_record?
      student_classroom.validate_assigned_student
      StudentJoinedClassroomWorker.perform_async(classroom_owner.id, student.id)
    elsif student_classroom.archived?
      student_classroom.validate_assigned_student
      student_classroom.unarchive!
    end
  rescue ActiveRecord::RecordNotUnique
    retry
  end

  private def classroom_owner
    @classroom_owner ||= classroom.owner
  end

  private def valid_classroom?
    classroom.is_a?(Classroom) &&
    Classroom.exists?(id: classroom.id, visible: true)
    classroom_owner.present?
  end

  private def valid_student?
    student.is_a?(User) && student.student?
  end
end
