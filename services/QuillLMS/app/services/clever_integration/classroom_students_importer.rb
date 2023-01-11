# frozen_string_literal: true

module CleverIntegration
  class ClassroomStudentsImporter < ApplicationService
    attr_reader :classroom, :students_data, :teacher_id

    def initialize(classroom, students_data, teacher_id)
      @classroom = classroom
      @students_data = students_data
      @teacher_id = teacher_id
    end

    def run
      return if students_data.nil? || students_data.empty?

      import_students
      associate_students_with_classroom
      associate_students_with_provider_classroom
    end

    private def associate_students_with_classroom
      CleverIntegration::Associators::StudentsToClassroom.run(students, classroom)
    end

    private def associate_students_with_provider_classroom
      ProviderClassroomUsersUpdater.run(classroom.clever_id, students.map(&:clever_id), CleverClassroomUser)
    end

    def import_students
      students
    end

    private def students
      @students ||= students_data.map { |student_data| CleverIntegration::StudentImporter.run(student_data, teacher_id) }
    end
  end
end
