# frozen_string_literal: true

class ProviderClassroomsWithUnsyncedStudentsFinder < ApplicationService
  attr_reader :teacher_id

  def initialize(teacher_id)
    @teacher_id = teacher_id
  end

  def run
    provider_classrooms_with_unsynced_students
  end

  private def classrooms_i_own
    teacher.classrooms_i_own
  end

  private def provider_classrooms
    classrooms_i_own
      .select(&:provider_classroom?)
      .map { |classroom| ProviderClassroom.new(classroom) }
  end

  private def provider_classrooms_with_unsynced_students
    provider_classrooms.reject { |provider_classroom| provider_classroom.unsynced_students.empty? }
  end

  private def teacher
    User.find_by(id: teacher_id)
  end
end
