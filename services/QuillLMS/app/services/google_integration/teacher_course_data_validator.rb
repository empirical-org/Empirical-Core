# frozen_string_literal: true

module GoogleIntegration
  class TeacherCourseDataValidator < ::ApplicationService
    attr_reader :course_data, :user_external_id

    def initialize(course_data, user_external_id)
      @course_data = course_data
      @user_external_id = user_external_id
    end

    def run
      owner? && (active? || already_imported?)
    end

    private def active?
      course_data.course_state == RestClient::ACTIVE_STATE
    end

    private def already_imported?
      ::Classroom.unscoped.exists?(google_classroom_id: course_data.id)
    end

    private def owner?
      course_data.owner_id == user_external_id
    end
  end
end
