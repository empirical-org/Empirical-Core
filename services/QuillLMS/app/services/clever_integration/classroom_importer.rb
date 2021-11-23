# frozen_string_literal: true

module CleverIntegration
  class ClassroomImporter < ApplicationService
    attr_reader :data, :clever_id

    def initialize(data)
      @data = data
      @clever_id = data[:clever_id]
    end

    def run
      classroom ? ClassroomUpdater.run(classroom, data) : ClassroomCreator.run(data)
    end

    private def classroom
      @classroom ||= ::Classroom.unscoped.find_by(clever_id: clever_id)
    end
  end
end
