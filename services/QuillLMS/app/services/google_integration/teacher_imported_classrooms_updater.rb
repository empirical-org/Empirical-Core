# frozen_string_literal: true

module GoogleIntegration
  class TeacherImportedClassroomsUpdater < ApplicationService
    attr_reader :teacher_id

    def initialize(teacher_id)
      @teacher_id = teacher_id
    end

    def run
      update_classrooms
    end

    private def classroom_data(classroom)
      classrooms_data.detect { |data| data[:google_classroom_id] = classroom.google_classroom_id }
    end

    private def classrooms_data
      @classrooms_data ||= TeacherClassroomsData.new(user, serialized_classrooms_data)
    end

    private def google_classroom_ids
      classrooms_data.map { |data| data[:google_classroom_id] }
    end

    private def imported_classrooms
      user.google_classrooms.unscoped.where(google_classroom_id: google_classroom_ids, visible: true)
    end

    private def serialized_classrooms_data
      TeacherClassroomsCache.get(teacher_id)
    end

    private def update_classrooms
      imported_classrooms.each { |classroom| ClassroomUpdater.run(classroom, classroom_data(classroom)) }
    end

    private def user
      ::User.find(teacher_id)
    end
  end
end
