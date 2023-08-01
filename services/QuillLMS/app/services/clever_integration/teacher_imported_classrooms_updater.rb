# frozen_string_literal: true

module CleverIntegration
  class TeacherImportedClassroomsUpdater < ApplicationService
    COTEACHER = ClassroomsTeacher::ROLE_TYPES[:coteacher]
    OWNER = ClassroomsTeacher::ROLE_TYPES[:owner]

    attr_reader :user

    def initialize(user)
      @user = user
    end

    def run
      update_classrooms_teachers
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

    private def existing_classrooms_where_teacher_was_added_in_clever
      ::Classroom.where(clever_id: classroom_external_ids - imported_classrooms.pluck(:clever_id))
    end

    private def imported_classrooms
      @imported_classrooms ||= user.clever_classrooms.where(clever_id: classroom_external_ids)
    end

    private def serialized_classrooms_data
      TeacherClassroomsCache.read(user.id)
    end

    private def update_classrooms
      imported_classrooms.each { |classroom| ClassroomUpdater.run(classroom, classroom_data(classroom) )}
    end

    private def update_classrooms_students
      ImportTeacherClassroomsStudentsWorker.perform_async(user.id, imported_classrooms.map(&:id))
    end

    private def update_classrooms_teachers
      existing_classrooms_where_teacher_was_added_in_clever.each do |classroom|
        user.classrooms_teachers.find_or_create_by!(
          classroom: classroom,
          role: classroom.classrooms_teachers.exists?(role: OWNER) ? COTEACHER : OWNER
        )
      end
    end
  end
end

