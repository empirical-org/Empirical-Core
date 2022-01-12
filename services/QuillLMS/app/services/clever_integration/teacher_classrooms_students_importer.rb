# frozen_string_literal: true

module CleverIntegration
  class TeacherClassroomsStudentsImporter < ApplicationService
    attr_reader :teacher, :classroom_ids

    def initialize(teacher, classroom_ids)
      @teacher = teacher
      @classroom_ids = classroom_ids
    end

    def run
      import_classroom_students
    end

    private def classrooms
      ::Classroom
        .where(id: classroom_ids)
        .where.not(clever_id: nil)
    end

    private def client
      @client ||= ClientFetcher.run(teacher)
    end

    private def import_classroom_students
      classrooms.each do |classroom|
        students_data = client.get_classroom_students(classroom.clever_id)
        ClassroomStudentsImporter.run(classroom, students_data)
      end
    end
  end
end
