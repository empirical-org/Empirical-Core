# frozen_string_literal: true

module CanvasIntegration
  class TeacherImportedClassroomsUpdater < ApplicationService
    attr_reader :user

    def initialize(user)
      @user = user
    end

    def run
      update_classrooms
      update_classrooms_students
    end

    private def classroom_data(classroom)
      classrooms_data.find { |data| data[:classroom_external_id] == classroom.classroom_external_id }
    end

    private def classrooms_data
      @classrooms_data ||= TeacherClassroomsData.new(user, serialized_classrooms_data)
    end

    private def classroom_external_ids
      classrooms_data.pluck(:classroom_external_id)
    end

    private def canvas_instance_id
      return nil if classrooms_data.blank?

      CanvasClassroom
        .unpack_classroom_external_id!(classrooms_data.first[:classroom_external_id])
        .first
    end

    private def external_ids
      classroom_external_ids
        .map { |classroom_external_id| CanvasClassroom.unpack_classroom_external_id!(classroom_external_id).second }
    end

    private def imported_classrooms
      @imported_classrooms ||=
        user
          .canvas_classrooms
          .joins(:canvas_classroom)
          .where(classrooms: { visible: true })
          .where(canvas_classroom: { canvas_instance_id: canvas_instance_id, external_id: external_ids })
    end

    private def serialized_classrooms_data
      CanvasIntegration::TeacherClassroomsCache.read(user.id)
    end

    private def update_classrooms
      imported_classrooms.each { |classroom| ClassroomUpdater.run(classroom, classroom_data(classroom)) }
    end

    private def update_classrooms_students
      ImportTeacherClassroomsStudentsWorker.perform_async(user.id, imported_classrooms.map(&:id))
    end
  end
end
