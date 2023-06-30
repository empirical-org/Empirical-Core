# frozen_string_literal: true

module CanvasIntegration
  class RestClient
    COURSES_PATH = 'courses'

    attr_reader :canvas_auth_credential

    def initialize(canvas_auth_credential)
      @canvas_auth_credential = canvas_auth_credential
    end

    def teacher_classrooms
      { canvas_instance_id: canvas_instance.id, classrooms: classrooms }
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
          ClassroomDataAdapter.run(course_data, section_data)
        end
      end.flatten
    end

    private def courses_data
      @courses_data ||= get_data(COURSES_PATH)
    end

    private def get_data(path)
      JSON
        .parse(api.api_get_request(path).body)
        .map(&:deep_symbolize_keys)
    end

    private def sections_data(course_id)
      get_data("#{COURSES_PATH}/#{course_id}/sections?include[]=students")
    end
  end
end
