# frozen_string_literal: true

module CanvasIntegration
  class ClassroomDataAdapter < ApplicationService
    attr_reader :canvas_instance_id, :course_id, :course_name, :section_id, :section_name, :section_students

    def initialize(canvas_instance_id, course_data, section_data)
      @canvas_instance_id = canvas_instance_id
      @course_id = course_data[:id]
      @course_name = course_data[:name]
      @section_id = section_data[:id]
      @section_name = section_data[:name]
      @section_students = section_data[:students] || []
    end

    def run
      {
        alreadyImported: already_imported?,
        classroom_external_id: CanvasClassroom.build_classroom_external_id(canvas_instance_id, section_id),
        name: classroom_name,
        students: students
      }
    end

    private def already_imported?
      ::CanvasClassroom.unscoped.exists?(canvas_instance_id: canvas_instance_id, external_id: section_id)
    end

    private def classroom_name
      return course_name if course_id == section_id && course_name == section_name

      "#{course_name} - #{section_name}"
    end

    private def students
      section_students.map do |section_student|
        {
          user_external_id: CanvasAccount.build_user_external_id(canvas_instance_id, section_student[:id]),
          name: section_student[:name]
        }
      end
    end
  end
end
