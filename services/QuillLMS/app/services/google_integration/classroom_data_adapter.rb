# frozen_string_literal: true

module GoogleIntegration
  class ClassroomDataAdapter < ::ApplicationService
    attr_reader :course_data, :student_count

    def initialize(course_data, student_count)
      @course_data = course_data
      @student_count = student_count
    end

    def run
      {
        alreadyImported: already_imported?,
        classroom_external_id: classroom_external_id,
        name: name,
        studentCount: student_count,
        year: year
      }
    end

    private def already_imported?
      ::Classroom.unscoped.exists?(google_classroom_id: classroom_external_id)
    end

    private def classroom_external_id
      course_data.id
    end

    private def name
      course_data.section ? "#{course_data.name} - #{course_data.section}" : course_data.name
    end

    private def year
      course_data.creation_time&.to_date&.year
    end
  end
end
