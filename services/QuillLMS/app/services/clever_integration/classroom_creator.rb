# frozen_string_literal: true

module CleverIntegration
  class ClassroomCreator < ApplicationService
    OWNER = ClassroomsTeacher::ROLE_TYPES[:owner].freeze

    attr_reader :clever_id, :grade, :name, :teacher_id

    def initialize(data)
      @clever_id = data[:clever_id]
      @grade = data[:grade]
      @name = data[:name]
      @teacher_id = data[:teacher_id]
    end

    def run
      Classroom.create!(
        clever_id: clever_id,
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

    private def role
      OWNER
    end

    private def synced_name
      name
    end
  end
end
