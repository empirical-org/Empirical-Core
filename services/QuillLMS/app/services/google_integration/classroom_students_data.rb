module GoogleIntegration
  class ClassroomStudentsData
    include Enumerable

    attr_reader :classroom, :classroom_students_client

    delegate :google_classroom_id, to: :classroom

    def initialize(classroom, classroom_students_client)
      @classroom = classroom
      @classroom_students_client = classroom_students_client
    end

    def each
      students_data.each { |student_data| yield student_data.merge(classroom: classroom) }
    end

    def google_ids
      students_data.map { |student_data| student_data[:google_id] }
    end

    private def raw_students_data
      classroom_students_client.call(google_classroom_id)
    end

    private def students_data
      GoogleIntegration::Classroom::Parsers::Students.run(raw_students_data)
    end
  end
end
