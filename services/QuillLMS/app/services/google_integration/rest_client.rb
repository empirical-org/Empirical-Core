# frozen_string_literal: true

module GoogleIntegration
  class RestClient
    ACTIVE_STATE = 'ACTIVE'
    ARCHIVED_STATE = 'ARCHIVED'
    MAX_RETRIES = 3
    ME = 'me'

    attr_reader :google_auth_credential, :user_external_id

    delegate :user_id, to: :google_auth_credential

    def initialize(google_auth_credential)
      @google_auth_credential = google_auth_credential
      @user_external_id = google_auth_credential.user.user_external_id

      api.authorization = AuthorizationClientFetcher.run(google_auth_credential)
    end

    def classroom_students(course_id)
      handle_google_api_errors do
        CourseStudentsAggregator
          .run(api, course_id)
          .map { |student_data| StudentDataAdapter.run(student_data) }
      end
    end

    def student_classrooms
      handle_google_api_errors do
        student_classrooms_data.map { |classroom_data| { classroom_external_id: classroom_data.id } }
      end
    end

    def teacher_classrooms
      handle_google_api_errors do
        [].tap do |classrooms_data|
          teacher_courses_data.each do |course_data|
            student_count = CourseStudentsAggregator.run(api, course_data.id).count
            classrooms_data << ClassroomDataAdapter.run(course_data, student_count)
          end
        end
      end
    end

    private def api
      @api ||= ::Google::Apis::ClassroomV1::ClassroomService.new
    end

    private def handle_google_api_errors
      retry_num = 0

      begin
        yield
      rescue Google::Apis::ClientError => e
        ErrorNotifier.report(e, user_id: user_id) unless e.status_code.in[403, 404]
        []
      rescue Google::Apis::TransmissionError, Google::Apis::ServerError => e
        if retry_num < MAX_RETRIES
          retry_num += 1
          sleep(2 ** retry_num)
          retry
        else
          ErrorNotifier.report(e, user_id: user_id)
          []
        end
      end
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
        &.select { |course_data| TeacherCourseDataValidator.run(course_data, user_external_id) } || []
    end
  end
end
