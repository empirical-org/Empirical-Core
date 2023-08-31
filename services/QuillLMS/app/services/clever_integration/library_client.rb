# frozen_string_literal: true

module CleverIntegration
  class LibraryClient
    include HTTParty
    base_uri 'https://api.clever.com/v2.0'

    class HttpError < StandardError; end

    def initialize(bearer_token)
      @options = { headers: { "Authorization": "Bearer #{bearer_token}" } }
    end

    def get_district(district_id:)
      get_path("/districts/#{district_id}", nil)
    end

    def get_teacher(teacher_id:)
      get_path("/teachers/#{teacher_id}", nil)
    end

    def classroom_students(section_id)
      get_path("/sections/#{section_id}/students", [])
        .map { |student_data| LibraryStudentDataAdapter.run(student_data) }
    end

    def teacher_classrooms(teacher_clever_id)
      get_path("/teachers/#{teacher_clever_id}/sections", [])
        .map { |classroom_data| LibraryClassroomDataAdapter.run(classroom_data) }
    end

    private def get_path(path, error_data)
      handle_response(self.class.get(path, @options), error_data)
    end

    private def handle_response(response, error_data)
      case response.code
      when 200
        response.parsed_response['data']
      when 401
        error_data
      else
        ErrorNotifier.report(HttpError.new("HTTP #{response.code}"))
        error_data
      end
    end
  end
end
