# frozen_string_literal: true

module GoogleIntegration
  class ClassroomCreator < ApplicationService
    OWNER = ClassroomsTeacher::ROLE_TYPES[:owner].freeze

    attr_reader :data, :classroom_external_id, :grade, :teacher_id

    def initialize(data)
      @data = data
      @classroom_external_id = data[:classroom_external_id]
      @grade = data[:grade]
      @teacher_id = data[:teacher_id]
    end

    def run
      ::Classroom.create!(
        google_classroom_id: classroom_external_id,
        grade: grade,
        name: name,
        synced_name: synced_name,
        classrooms_teachers_attributes: [
          {
            user_id: teacher_id,
            role: role
          }
        ]
      )
    end

    private def name
      data[:name].present? ? valid_name : "Classroom #{classroom_external_id}"
    end

    private def other_owned_classroom_names
      teacher.classrooms_i_own.pluck(:name)
    end

    private def role
      OWNER
    end

    private def synced_name
      data[:name]
    end

    private def teacher
      ::User.find(teacher_id)
    end

    private def valid_name
      ::ValidNameBuilder.run(data[:name], other_owned_classroom_names)
    end
  end
end
