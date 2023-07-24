# frozen_string_literal: true

module CanvasIntegration
  class RestClient
    COURSES_PATH = 'courses'
    SECTIONS_PATH = 'sections'

    attr_reader :canvas_auth_credential

    def initialize(canvas_auth_credential)
      @canvas_auth_credential = canvas_auth_credential
    end

    def classroom_students(section_id)
      { students: students(section_id) }
    end

    def teacher_classrooms
      { classrooms: classrooms }
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

    private def classrooms
      courses_data.map do |course_data|
        sections_data(course_data[:id]).map do |section_data|
          ClassroomDataAdapter.run(canvas_instance.id, course_data, section_data)
        end
      end.flatten
    end

    private def courses_data
      @courses_data ||= get_collection(COURSES_PATH)
    end

    private def get_data(path)
      JSON.parse(api.api_get_request(path).body)
    end

    private def get_member(path)
      get_data(path).deep_symbolize_keys
    end

    private def get_collection(path)
      get_data(path).map(&:deep_symbolize_keys)
    end

    private def section_data(section_id)
      get_member("#{SECTIONS_PATH}/#{section_id}?include[]=students")
    end

    private def sections_data(course_id)
      get_collection("#{COURSES_PATH}/#{course_id}/sections?include[]=students") || []
    end

    private def students(section_id)
      students_data(section_id)
        .map { |student_data| StudentDataAdapter.run(canvas_instance.id, student_data) }
    end

    private def students_data(section_id)
      section_data(section_id)[:students] || []
    end
  end
end
