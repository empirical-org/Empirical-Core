# frozen_string_literal: true

module CanvasIntegration
  class ClassroomImporter < ApplicationService
    attr_reader :data, :canvas_instance_id, :external_id

    def initialize(data)
      @data = data
      @classroom_external_id = data[:classroom_external_id]
      @canvas_instance_id, @external_id = ::CanvasClassroom.unpack_classroom_external_id!(data[:classroom_external_id])
    end

    def run
      classroom ? ClassroomUpdater.run(classroom, data) : ClassroomCreator.run(data)
    end

    private def classroom
      @classroom ||=
        Classroom
          .unscoped
          .joins(:canvas_classroom)
          .find_by(canvas_classroom: { canvas_instance_id: canvas_instance_id, external_id: external_id })
    end
  end
end
