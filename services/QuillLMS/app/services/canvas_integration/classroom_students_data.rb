# frozen_string_literal: true

module CanvasIntegration
  class ClassroomStudentsData
    include Enumerable

    attr_reader :classroom, :client

    delegate :classroom_external_id, to: :classroom

    def initialize(classroom, client)
      @classroom = classroom
      @client = client
    end

    def each
      students_data.each { |student_data| yield student_data.merge(classroom: classroom) }
    end

    private def external_id
      ::CanvasClassroom
        .unpack_classroom_external_id!(classroom_external_id)
        .second
    end

    private def students_data
      client.classroom_students(external_id) || []
    end
  end
end
