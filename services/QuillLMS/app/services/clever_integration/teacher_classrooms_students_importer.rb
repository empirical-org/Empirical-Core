# frozen_string_literal: true

module CleverIntegration
  class TeacherClassroomsStudentsImporter < ApplicationService
    attr_reader :teacher, :classroom_ids

    def initialize(teacher, classroom_ids)
      @teacher = teacher
      @classroom_ids = classroom_ids
    end

    def run
      import_classrooms_students
    end

    private def classrooms
      ::Classroom
        .where(id: classroom_ids)
        .where.not(clever_id: nil)
    end

    private def client
      @client ||= ClientFetcher.run(teacher)
    end

    private def classrooms_students_data
      classrooms.map { |classroom| ClassroomStudentsData.new(classroom, client) }
    end

    private def import_classrooms_students
      classrooms_students_data.each { |classroom_students_data| ClassroomStudentsImporter.run(classroom_students_data) }
    end
  end
end
