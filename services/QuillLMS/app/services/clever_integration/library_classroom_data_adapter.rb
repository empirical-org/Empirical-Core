# frozen_string_literal: true

module CleverIntegration
  class LibraryClassroomDataAdapter < ApplicationService
    attr_reader :classroom_data

    def initialize(classroom_data)
      @classroom_data = classroom_data
    end

    def run
      {
        alreadyImported: already_imported?,
        classroom_external_id: classroom_external_id,
        grade: data[:grade],
        name: data[:name],
        studentCount: data[:students]&.count || 0,
      }
    end

    private def already_imported?
      ::Classroom.unscoped.exists?(clever_id: classroom_external_id)
    end

    private def classroom_external_id
      data[:id]
    end

    private def data
      @data ||= classroom_data['data'].deep_symbolize_keys
    end
  end
end
