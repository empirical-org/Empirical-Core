module CleverIntegration
  class ClassroomUpdater < ApplicationService
    OWNER = ClassroomsTeacher::ROLE_TYPES[:owner].freeze
    COTEACHER = ClassroomsTeacher::ROLE_TYPES[:coteacher].freeze

    attr_reader :classroom, :grade, :synced_name, :teacher_id

    def initialize(classroom, data)
      @classroom = classroom
      @grade = data[:grade]
      @synced_name = data[:name]
      @teacher_id = data[:teacher_id]
    end

    def run
      update
      associate_teacher_and_classroom
      classroom.reload
    end

    private def associate_teacher_and_classroom
      return if ClassroomsTeacher.exists?(classroom: classroom, user_id: teacher_id)

      ClassroomsTeacher.create!(
        classroom: classroom,
        user_id: teacher_id,
        role: classroom.owner ? COTEACHER : OWNER
      )
    end

    private def custom_name?
      classroom.name != classroom.synced_name
    end

    private def name
      custom_name? ? classroom.name : synced_name
    end

    private def update
      classroom.update!(
        name: name,
        synced_name: synced_name,
        grade: grade
      )
    end
  end
end
