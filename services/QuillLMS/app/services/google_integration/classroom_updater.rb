# frozen_string_literal: true

module GoogleIntegration
  class ClassroomUpdater < ApplicationService
    attr_reader :classroom, :data, :teacher_id

    def initialize(classroom, data)
      @data = data
      @classroom = classroom
      @teacher_id = data[:teacher_id]
    end

    def run
      update
      classroom
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
      @other_owned_classroom_names ||= teacher.classrooms_i_own.reject { |c| c.id == classroom.id }.pluck(:name)
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
        visible: visible
      )
    end

    private def valid_name
      ::DuplicateNameResolver.run(data[:name], other_owned_classroom_names)
    end

    private def visible
      true
    end
  end
end
