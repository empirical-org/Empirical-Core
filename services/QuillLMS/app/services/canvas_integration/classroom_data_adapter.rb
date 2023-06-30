# frozen_string_literal: true

module CanvasIntegration
  class ClassroomDataAdapter < ApplicationService
    attr_reader :course_id, :course_name, :section_id, :section_name, :section_students

    def initialize(course_data, section_data)
      @course_id = course_data[:id]
      @course_name = course_data[:name]
      @section_id = section_data[:id]
      @section_name = section_data[:name]
      @section_students = section_data[:students] || []
    end

    def run
      {
        name: classroom_name,
        external_classroom_id: section_id,
        students: students
      }
    end

    private def classroom_name
      return course_name if course_id == section_id && course_name == section_name

      "#{course_name} - #{section_name}"
    end

    private def students
      section_students.map do |section_student|
        {
          external_user_id: section_student[:id],
          name: section_student[:name]
        }
      end
    end
  end
end
