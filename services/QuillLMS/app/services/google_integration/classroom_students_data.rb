# frozen_string_literal: true

module GoogleIntegration
  class ClassroomStudentsData
    include Enumerable

    attr_reader :classroom, :classroom_students_client

    delegate :classroom_external_id, :google_classroom_id, to: :classroom

    def initialize(classroom, classroom_students_client)
      @classroom = classroom
      @classroom_students_client = classroom_students_client
    end

    def each
      students_data.each { |student_data| yield student_data.merge(classroom: classroom) }
    end

    private def raw_students_data
      classroom_students_client.call(google_classroom_id)
    end

    private def students_data
      GoogleIntegration::Classroom::Parsers::Students.run(raw_students_data)
    end
  end
end
