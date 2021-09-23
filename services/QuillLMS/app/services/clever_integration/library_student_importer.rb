module CleverIntegration
  class LibraryStudentImporter
    attr_reader :classroom_ids, :client

    def initialize(classroom_ids, client)
      @classroom_ids = classroom_ids
      @client = client
    end

    def run
      clever_classrooms.each do |classroom|
        students_data = client.get_section_students(section_id: classroom.clever_id)
        CleverIntegration::ClassroomStudentsImporter.new(classroom, students_data).run
      end
    end

    private def clever_classrooms
      ::Classroom
        .where(id: classroom_ids)
        .where.not(clever_id: nil)
    end
  end
end
