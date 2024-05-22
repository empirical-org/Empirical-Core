# frozen_string_literal: true

module GoogleIntegration
  class ClassroomImporter < ApplicationService
    attr_reader :data, :classroom_external_id

    def initialize(data)
      @data = data
      @classroom_external_id = data[:classroom_external_id]
    end

    def run
      classroom ? ClassroomUpdater.run(classroom, data) : ClassroomCreator.run(data)
    end

    private def classroom
      @classroom ||= ::Classroom.unscoped.find_by(google_classroom_id: classroom_external_id)
    end
  end
end
