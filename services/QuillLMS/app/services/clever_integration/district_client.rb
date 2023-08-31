# frozen_string_literal: true

require 'clever-ruby'

module CleverIntegration
  class DistrictClient
    attr_reader :district_token

    def initialize(district_token = nil)
      @district_token = district_token
    end

    def district_name(district_clever_id)
      data_api
        .get_district(district_clever_id)
        .data
        .name
    end

    def teacher_classrooms(teacher_clever_id)
      data_api
        .get_sections_for_teacher(teacher_clever_id)
        .data
        .map { |classroom_data| DistrictClassroomDataAdapter.run(classroom_data) }
    end

    def classroom_students(classroom_clever_id)
      handle_client_errors do
        data_api
          .get_students_for_section(classroom_clever_id)
          .data
          .map { |student_data| DistrictStudentDataAdapter.run(student_data) }
      end
    end

    private def data_api
      @data_api ||= begin
        config = ::Clever::Configuration.new
        config.access_token = district_token
        api_instance = ::Clever::DataApi.new
        api_instance.api_client.config = config
        api_instance
      end
    end
  end
end
