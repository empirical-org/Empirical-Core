module GoogleIntegration
  class ClassroomStudentsImporter
    attr_reader :classroom_students_data

    delegate :google_classroom_id, :google_ids, to: :classroom_students_data

    def initialize(classroom_students_data)
      @classroom_students_data = classroom_students_data
    end

    def run
      import_classroom_students
      update_provider_classroom_users
    end

    private def import_classroom_students
      classroom_students_data.each { |classroom_student_data| ClassroomStudentImporter.new(classroom_student_data).run }
    end

    private def update_provider_classroom_users
      GoogleClassroomUsersUpdater.new(google_classroom_id, google_ids).run
    end
  end
end
