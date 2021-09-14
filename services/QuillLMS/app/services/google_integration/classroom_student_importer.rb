module GoogleIntegration
  class ClassroomStudentImporter
    ROLE = ::User::STUDENT

    attr_reader :data

    def initialize(data)
      @data = data
    end

    def run
      return if invalid_email?

      update_existing_student_with_google_id_and_different_email
      import_student
      assign_classroom
    end

    private def assign_classroom
      Associators::StudentsToClassrooms.run(student, classroom)
    end

    private def classroom
      data[:classroom]
    end

    private def email
      data[:email]&.downcase
    end

    private def import_student
      importer_class.new(data).run
    end

    private def importer_class
      student.present? ? ClassroomStudentUpdater : ClassroomStudentCreator
    end

    private def invalid_email?
      email.nil?
    end

    private def student
      @student ||= ::User.find_by(email: email, role: ROLE)
    end

    private def update_existing_student_with_google_id_and_different_email
      StudentEmailUpdater.new(data).run
    end
  end
end
