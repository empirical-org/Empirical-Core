# frozen_string_literal: true

module CleverIntegration
  class TeacherImportedClassroomsUpdater < ApplicationService
    attr_reader :teacher_id

    def initialize(teacher_id)
      @teacher_id = teacher_id
    end

    def run
      update_classrooms
      update_classrooms_students
    end

    private def classroom_clever_ids
      classrooms_data.map { |data| data[:clever_id] }
    end

    private def classrooms_data
      @classrooms_data ||= TeacherClassroomsData.new(teacher, serialized_classrooms_data)
    end

    private def imported_classrooms
      Classroom.where(clever_id: classroom_clever_ids)
    end

    private def serialized_classrooms_data
      TeacherClassroomsCache.get(teacher_id)
    end

    private def teacher
      ::User.find(teacher_id)
    end

    private def update_classrooms
      classrooms_data.each { |classroom_data| ClassroomImporter.run(classroom_data) }
    end

    private def update_classrooms_students
      ImportStudentsWorker.perform_async(teacher_id, imported_classrooms.map(&:id))
    end

    # These will be utilized in subsequent frontend UI PR

    # private def classroom_data(classroom)
    #   classrooms_data.detect { |data| data[:clever_id] == classroom.clever_id }
    # end

    # private def imported_classrooms
    #   teacher.clever_classrooms.where(clever_id: classroom_clever_ids)
    # end

    # private def update_classrooms
    #   imported_classrooms.each { |classroom| ClassroomUpdater.run(classroom, classroom_data(classroom)) }
    # end

    # private def update_classrooms_students
    #   ImportStudentsWorker.perform_async(teacher_id, imported_classrooms.map(&:id))
    # end
  end
end

