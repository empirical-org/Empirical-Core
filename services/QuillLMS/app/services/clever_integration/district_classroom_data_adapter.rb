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
        coteachers: data.teachers,
        grade: data.grade,
        name: data.name,
        owner: data.teacher,
        students: data.students
      }
    end

    private def data
      classroom_data.data
    end
  end
end
