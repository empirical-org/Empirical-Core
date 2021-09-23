module CleverIntegration
  class ClassroomStudentsImporter
    attr_reader :classroom, :students_data

    def initialize(classroom, students_data)
      @classroom = classroom
      @students_data = students_data
    end

    def run
      return if students_data.nil? || students_data.empty?

      associate_students_with_classroom
      associate_students_with_provider_classroom
    end

    private def associate_students_with_classroom
      CleverIntegration::Associators::StudentsToClassroom.run(students, classroom)
    end

    private def associate_students_with_provider_classroom
      ProviderClassroomUsersUpdater.new(classroom.clever_id, students.map(&:clever_id), CleverClassroomUser).run
    end

    private def parsed_students_data
      students_data.map { |student_data| parsed_student_data(student_data['id'], student_data['name']) }
    end

    private def parsed_student_data(id, name)
      {
        clever_id: id,
        name: "#{name['first']} #{name['middle']} #{name['last']}".squish,
        username: id
      }
    end

    private def import_students
      students
    end

    private def students
      @students ||= CleverIntegration::Creators::Students.run(parsed_students_data)
    end
  end
end
