# frozen_string_literal: true

module GoogleIntegration
  class RestClient
    ACTIVE_STATE = 'ACTIVE'
    ARCHIVED_STATE = 'ARCHIVED'

    attr_reader :google_auth_credential, :user_external_id

    def initialize(google_auth_credential)
      @google_auth_credential = google_auth_credential
      @user_external_id = google_auth_credential.user.user_external_id

      api.authorization = AuthorizationClientFetcher.run(google_auth_credential)
    end

    def classroom_students(course_id)
      CourseStudentsAggregator
        .run(api, course_id)
        .map { |student_data| StudentDataAdapter.run(student_data) }
    end

    def student_classrooms
      student_classrooms_data.map { |classroom_data| { classroom_external_id: classroom_data.id } }
    end

    def teacher_classrooms
      [].tap do |classrooms_data|
        teacher_courses_data.each do |course_data|
          student_count = CourseStudentsAggregator.run(api, course_data.id).count
          classrooms_data << ClassroomDataAdapter.run(course_data, student_count)
        rescue => e
          ::ErrorNotifier.report(e, course_id: course_data.id, user_id: google_auth_credential.user_id)
          next
        end
      end
    end

    private def api
      @api ||= ::Google::Apis::ClassroomV1::ClassroomService.new
    end

    private def student_classrooms_data
      api
        .list_courses(course_states: [ACTIVE_STATE, ARCHIVED_STATE])
        &.courses
        &.select { |course_data| course_data.owner_id != user_external_id } || []
    end

    private def teacher_courses_data
      api
        .list_courses(course_states: [ACTIVE_STATE, ARCHIVED_STATE])
        &.courses
        &.select { |course_data| TeacherCourseDataValidator.run(course_data, user_external_id) } || []
    end
  end
end
