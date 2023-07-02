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

    private def classroom_clever_ids
      classrooms_data.map { |data| data[:clever_id] }
    end

    private def classroom_data(classroom)
      classrooms_data.detect { |data| data[:clever_id] == classroom.clever_id }
    end

    private def classrooms_data
      @classrooms_data ||= TeacherClassroomsData.new(user, serialized_classrooms_data)
    end

    private def existing_classrooms_where_teacher_was_added_in_clever
      ::Classroom.where(clever_id: classroom_clever_ids - imported_classrooms.pluck(:clever_id))
    end

    private def imported_classrooms
      @imported_classrooms ||= user.clever_classrooms.where(clever_id: classroom_clever_ids)
    end

    private def serialized_classrooms_data
      CleverIntegration::TeacherClassroomsCache.read(user.id)
    end

    private def update_classrooms
      imported_classrooms.each { |classroom| ClassroomUpdater.run(classroom, classroom_data(classroom) )}
    end

    private def update_classrooms_students
      ImportClassroomStudentsWorker.perform_async(user.id, imported_classrooms.map(&:id))
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

