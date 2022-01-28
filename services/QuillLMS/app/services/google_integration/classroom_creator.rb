# frozen_string_literal: true

module GoogleIntegration
  class ClassroomCreator < ApplicationService
    OWNER = ClassroomsTeacher::ROLE_TYPES[:owner].freeze

    attr_reader :data, :google_classroom_id, :teacher_id

    def initialize(data)
      @data = data
      @google_classroom_id = data[:google_classroom_id]
      @teacher_id = data[:teacher_id]
    end

    def run
      classroom
    end

    private def classroom
      ::Classroom.create!(
        google_classroom_id: google_classroom_id,
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
      data[:name].present? ? valid_name : "Classroom #{google_classroom_id}"
    end

    private def other_owned_classroom_names
      @other_owned_classroom_names ||= teacher.classrooms_i_own.pluck(:name)
    end

    private def role
      OWNER
    end

    private def teacher
      ::User.find(teacher_id)
    end

    private def synced_name
      data[:name]
    end

    private def valid_name
      temp_name = data[:name]

      loop do
        return temp_name unless other_owned_classroom_names.include?(temp_name)

        temp_name += '_1'
      end
    end
  end
end
