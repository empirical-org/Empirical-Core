# frozen_string_literal: true

module CleverIntegration
  class ClassroomStudentsData
    include Enumerable

    attr_reader :classroom, :client

    delegate :classroom_external_id, :clever_id, to: :classroom

    def initialize(classroom, client)
      @classroom = classroom
      @client = client
    end

    def each
      students_data.each { |student_data| yield student_data.merge(classroom: classroom) }
    end

    private def students_data
      client.classroom_students(clever_id) || []
    end
  end
end
