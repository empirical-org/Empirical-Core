# frozen_string_literal: true

module CleverIntegration
  class ClassroomUpdater < ApplicationService
    OWNER = ClassroomsTeacher::ROLE_TYPES[:owner].freeze
    COTEACHER = ClassroomsTeacher::ROLE_TYPES[:coteacher].freeze

    attr_reader :classroom, :data, :teacher_id

    def initialize(classroom, data)
      @classroom = classroom
      @data = data
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

    private def grade
      data.fetch(:grade, classroom.grade)
    end

    private def name
      custom_name? ? classroom.name : valid_name
    end

    private def other_owned_classroom_names
      teacher.classrooms_i_own.reject { |c| c.id == classroom.id }.pluck(:name)
    end

    private def synced_name
      data[:name]
    end

    private def teacher
      ::User.find(teacher_id)
    end

    private def update
      classroom.update!(
        name: name,
        synced_name: synced_name,
        grade: grade,
        visible: true
      )
    end

    private def valid_name
      ::DuplicateNameResolver.run(data[:name], other_owned_classroom_names)
    end
  end
end
