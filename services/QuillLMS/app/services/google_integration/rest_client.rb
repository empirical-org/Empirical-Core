# frozen_string_literal: true

module GoogleIntegration
  class RestClient
    ACTIVE_STATE = 'ACTIVE'
    ARCHIVED_STATE = 'ARCHIVED'
    ME = 'me'

    attr_reader :google_auth_credential, :user_external_id

    delegate :user_id, to: :google_auth_credential

    def initialize(google_auth_credential)
      @google_auth_credential = google_auth_credential
      @user_external_id = google_auth_credential.user.user_external_id

      api.authorization = AuthorizationClientFetcher.run(google_auth_credential)
    end

    def classroom_students(course_id)
      handle_client_errors do
        CourseStudentsAggregator
          .run(api, course_id)
          .map { |student_data| StudentDataAdapter.run(student_data) }
      end
    end

    def student_classrooms
      handle_client_errors do
        student_classrooms_data.map { |classroom_data| { classroom_external_id: classroom_data.id } }
      end
    end

    def teacher_classrooms
      handle_client_errors do
        [].tap do |classrooms_data|
          teacher_courses_data.each do |course_data|
            student_count = CourseStudentsAggregator.run(api, course_data.id).count
            classrooms_data << ClassroomDataAdapter.run(course_data, student_count, user_external_id)
          end
        end
      end
    end

    private def api
      @api ||= ::Google::Apis::ClassroomV1::ClassroomService.new
    end

    private def handle_client_errors
      yield
    rescue Google::Apis::ClientError => e
      e.status_code == 403 ? [] : ErrorNotifier.report(e, user_id: user_id)
    end

    private def student_classrooms_data
      api
        .list_courses(student_id: ME, course_states: [ACTIVE_STATE, ARCHIVED_STATE])
        &.courses
        &.select { |course_data| course_data.owner_id != user_external_id } || []
    end

    private def teacher_courses_data
      api
        .list_courses(teacher_id: ME, course_states: [ACTIVE_STATE, ARCHIVED_STATE])
        &.courses
        &.select { |course_data| TeacherCourseDataValidator.run(course_data) } || []
    end
  end
end
