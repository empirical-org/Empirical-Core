# frozen_string_literal: true

module GoogleIntegration
  class ClassroomStudentImporter < ApplicationService
    ROLE = ::User::STUDENT

    attr_reader :data, :classroom, :email

    def initialize(data)
      @data = data
      @classroom = data[:classroom]
      @email = data[:email]&.downcase
    end

    def run
      return unless email.present?

      update_student_with_google_id_and_different_email

      if student_is_active_teacher?
        log_skipped_import
      else
        import_student
        assign_classroom
      end
    end

    private def assign_classroom
      Associators::StudentsToClassrooms.run(student, classroom)
    end

    private def import_student
      student ? ClassroomStudentUpdater.run(student, data) : ClassroomStudentCreator.run(data)
    end

    private def log_skipped_import
      ChangeLog.find_or_create_by(
        changed_record: student,
        action: ChangeLog::USER_ACTIONS[:skipped_import],
        explanation: caller_locations[0].to_s
      )
    end

    private def student
      @student ||= ::User.find_by(email: email)
    end

    private def student_is_active_teacher?
      student&.teacher? && ::ClassroomsTeacher.exists?(user: student)
    end

    private def update_student_with_google_id_and_different_email
      StudentEmailUpdater.new(data).run
    end
  end
end
