# frozen_string_literal: true

module GoogleIntegration
  class TeacherCourseDataValidator < ::ApplicationService
    attr_reader :course_data

    def initialize(course_data)
      @course_data = course_data
    end

    def run
      active? || already_imported?
    end

    private def active?
      course_data.course_state == RestClient::ACTIVE_STATE
    end

    private def already_imported?
      ::Classroom.unscoped.exists?(google_classroom_id: course_data.id)
    end
  end
end
