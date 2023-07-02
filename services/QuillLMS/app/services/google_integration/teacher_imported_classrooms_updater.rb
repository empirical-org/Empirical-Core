# frozen_string_literal: true

module GoogleIntegration
  class TeacherImportedClassroomsUpdater < ApplicationService
    attr_reader :user

    def initialize(user)
      @user = user
    end

    def run
      update_classrooms
    end

    private def classroom_data(classroom)
      classrooms_data.detect { |data| data[:google_classroom_id] == classroom.google_classroom_id }
    end

    private def classrooms_data
      @classrooms_data ||= TeacherClassroomsData.new(user, serialized_classrooms_data)
    end

    private def google_classroom_ids
      classrooms_data.map { |data| data[:google_classroom_id] }
    end

    private def imported_classrooms
      user.google_classrooms.where(google_classroom_id: google_classroom_ids, visible: true)
    end

    private def serialized_classrooms_data
      GoogleIntegration::TeacherClassroomsCache.read(user.id)
    end

    private def update_classrooms
      imported_classrooms.each { |classroom| ClassroomUpdater.run(classroom, classroom_data(classroom)) }
    end
  end
end
