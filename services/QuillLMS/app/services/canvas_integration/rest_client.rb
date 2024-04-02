# frozen_string_literal: true

module CanvasIntegration
  class RestClient
    COURSES_PATH = 'courses'
    CREATED_AT_THRESHOLD = 2.years
    SECTIONS_PATH = 'sections'

    attr_reader :canvas_auth_credential

    def initialize(canvas_auth_credential)
      @canvas_auth_credential = canvas_auth_credential
    end

    def classroom_students(section_id)
      students_data(section_id).map { |student_data| StudentDataAdapter.run(canvas_instance.id, student_data) }
    end

    def teacher_classrooms
      courses_data.map do |course_data|
        sections_data(course_data[:id]).map do |section_data|
          ClassroomDataAdapter.run(canvas_instance.id, course_data, section_data)
        end
      end.flatten
    end

    private def api
      @api ||=
        ::LMS::Canvas.new(
          canvas_instance.url,
          canvas_auth_credential,
          client_id: canvas_instance.client_id,
          client_secret: canvas_instance.client_secret,
          refresh_token: canvas_auth_credential.refresh_token,
          redirect_uri: Auth::Canvas::OMNIAUTH_CALLBACK_PATH
        )
    end

    private def canvas_instance
      @canvas_instance ||= canvas_auth_credential.canvas_instance
    end

    private def courses_data
      get_collection(COURSES_PATH)
        .select { |course_data| course_data[:created_at].present? && course_data[:created_at] > CREATED_AT_THRESHOLD.ago }
    end

    private def get_data(path)
      JSON.parse(api.api_get_request(path).body)
    end

    private def get_member(path)
      get_data(path).deep_symbolize_keys
    end

    private def get_collection(path)
      api.api_get_all_request(path)&.map(&:deep_symbolize_keys) || []
    end

    private def section_data(section_id)
      get_member("#{SECTIONS_PATH}/#{section_id}?include[]=students")
    end

    private def sections_data(course_id)
      get_collection("courses/#{course_id}/sections?include[]=students")
        .select { |section_data| section_data[:students].present? }
    rescue LMS::Canvas::InvalidAPIRequestException => e
      []
    end

    private def students_data(section_id)
      section_data(section_id)[:students] || []
    end
  end
end