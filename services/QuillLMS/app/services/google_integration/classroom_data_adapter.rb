# frozen_string_literal: true

module GoogleIntegration
  class ClassroomDataAdapter < ::ApplicationService
    attr_reader :course_data, :student_count, :user_external_id

    def initialize(course_data, student_count, user_external_id)
      @course_data = course_data
      @student_count = student_count
      @user_external_id = user_external_id
    end

    def run
      {
        alreadyImported: already_imported?,
        classroom_external_id: classroom_external_id,
        name: name,
        studentCount: student_count,
        year: year,
        is_owner: owner?,
        archived: already_imported? && !already_imported_classroom.visible
      }
    end

    private def already_imported?
      already_imported_classroom&.present? || false
    end

    private def already_imported_classroom
      @already_imported_classroom ||= ::Classroom.unscoped.find_by(google_classroom_id: classroom_external_id)
    end

    private def classroom_external_id
      course_data.id.to_i
    end

    private def name
      course_data.section ? "#{course_data.name} - #{course_data.section}" : course_data.name
    end

    private def year
      course_data.creation_time&.to_date&.year
    end

    private def owner?
      course_data.owner_id == user_external_id
    end
  end
end
