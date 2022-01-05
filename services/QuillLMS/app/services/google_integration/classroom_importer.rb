# frozen_string_literal: true

module GoogleIntegration
  class ClassroomImporter < ApplicationService
    attr_reader :data

    def initialize(data)
      @data = data
    end

    def run
      classroom.present? ? ClassroomUpdater.run(classroom, data) : ClassroomCreator.run(data)
    end

    private def classroom
      ::Classroom.unscoped.find_by(google_classroom_id: google_classroom_id, teacher_id: teacher_id)
    end

    private def google_classroom_id
      data[:google_classroom_id]
    end

    private def teacher_id
      data[:teacher_id]
    end
  end
end
