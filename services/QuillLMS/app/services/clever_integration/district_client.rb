# frozen_string_literal: true

module CleverIntegration
  class DistrictClient
    attr_reader :district_token

    def initialize(district_token = nil)
      @district_token = district_token
    end

    def get_teacher_classrooms(teacher_clever_id)
      data_api
        .get_sections_for_teacher(teacher_clever_id)
        .data
        .map { |classroom_data| DistrictClassroomDataAdapter.run(classroom_data) }
    end

    def get_classroom_students(classroom_clever_id)
      data_api
        .get_students_for_section(classroom_clever_id)
        .data
        .map { |student_data| DistrictStudentDataAdapter.run(student_data) }
    end

    private def data_api
      @data_api ||= begin
        config = Clever::Configuration.new
        config.access_token = district_token
        api_instance = Clever::DataApi.new
        api_instance.api_client.config = config
        api_instance
      end
    end
  end
end
