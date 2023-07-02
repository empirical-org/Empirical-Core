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
        clever_id: data[:id],
        grade: data[:grade],
        name: data[:name],
        students: data[:students]
      }
    end

    private def already_imported?
      ::Classroom.unscoped.exists?(clever_id: data[:id])
    end

    private def data
      @data ||= classroom_data["data"].deep_symbolize_keys
    end
  end
end
