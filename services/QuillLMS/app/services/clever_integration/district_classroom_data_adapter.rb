# frozen_string_literal: true

module CleverIntegration
  class DistrictClassroomDataAdapter < ApplicationService
    attr_reader :classroom_data

    delegate :grade, :name, :students, to: :data

    def initialize(classroom_data)
      @classroom_data = classroom_data
    end

    def run
      {
        alreadyImported: already_imported?,
        clever_id: clever_id,
        grade: grade,
        name: name,
        students: students
      }
    end

    private def already_imported?
      ::Classroom.unscoped.exists?(clever_id: clever_id)
    end

    private def clever_id
      data.id
    end

    private def data
      classroom_data.data
    end
  end
end
