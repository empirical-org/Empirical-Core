# frozen_string_literal: true

module CanvasIntegration
  class ClassroomCreator < ApplicationService
    class CanvasInstanceNotFoundError < StandardError; end

    OWNER = ClassroomsTeacher::ROLE_TYPES[:owner].freeze

    attr_reader :classroom_external_id, :canvas_instance_id, :external_id, :data, :teacher_id

    def initialize(data)
      @data = data
      @classroom_external_id = data[:classroom_external_id]
      @canvas_instance_id, @external_id = ::CanvasClassroom.unpack_classroom_external_id!(classroom_external_id)
      @teacher_id = data[:teacher_id]
    end

    def run
      ::Classroom.create!(
        name: name,
        synced_name: synced_name,
        canvas_classroom_attributes: {
          canvas_instance: canvas_instance,
          external_id: external_id
        },
        classrooms_teachers_attributes: [
          {
            role: role,
            user_id: teacher_id
          }
        ]
      )
    end

    private def canvas_instance
      ::CanvasInstance.find_by(id: canvas_instance_id) || raise(CanvasInstanceNotFoundError)
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
