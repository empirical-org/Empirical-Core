# frozen_string_literal: true

module CleverIntegration
  class DistrictClassroomDataAdapter < ApplicationService
    attr_reader :classroom_data

    def initialize(classroom_data)
      @classroom_data = classroom_data
    end

    def run
      {
        clever_id: data.id,
        grade: data.grade,
        name: data.name,
        students: data.students
      }
    end

    private def data
      classroom_data.data
    end
  end
end
