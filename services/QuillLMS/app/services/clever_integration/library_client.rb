# frozen_string_literal: true

module CleverIntegration
  class LibraryClient
    include HTTParty
    base_uri 'https://api.clever.com/v2.0'

    def initialize(bearer_token)
      @options = { headers: { "Authorization": "Bearer #{bearer_token}" } }
    end

    def get_district(district_id:)
      get_path("/districts/#{district_id}")
    end

    def get_teacher(teacher_id:)
      get_path("/teachers/#{teacher_id}")
    end

    def get_teacher_classrooms(teacher_clever_id)
      get_path("/teachers/#{teacher_clever_id}/sections")
        .map { |classroom_data| LibraryClassroomDataAdapter.run(classroom_data) }
    end

    def get_classroom_students(section_id)
      get_path("/sections/#{section_id}/students")
        .map { |student_data| LibraryStudentDataAdapter.run(student_data) }
    end

    private def get_path(path)
      self.class.get(path, @options).parsed_response["data"]
    end
  end
end
