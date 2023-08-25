# frozen_string_literal: true

module GoogleIntegration
  class ClassroomStudentImporter < ApplicationService
    ROLE = ::User::STUDENT

    attr_reader :classroom, :data, :email

    def initialize(data)
      @data = data
      @classroom = data[:classroom]
      @email = data[:email]&.downcase
    end

    def run
      return unless email.present?

      update_student_containing_inconsistent_email_and_google_id

      student_is_active_teacher? ? log_skipped_import : assign_classroom
    end

    private def assign_classroom
      ::StudentClassroomAssociator.run(imported_student, classroom)
    end

    private def existing_student
      @existing_student ||= ::User.find_by(email: email)
    end

    private def imported_student
      existing_student ? StudentUpdater.run(existing_student, data) : StudentCreator.run(data)
    end

    private def log_skipped_import
      ChangeLog.find_or_create_by(
        changed_record: existing_student,
        action: ChangeLog::GOOGLE_IMPORT_ACTIONS[:skipped_import],
        explanation: caller_locations[0].to_s
      )
    end

    private def student_is_active_teacher?
      existing_student&.teacher? && ::ClassroomsTeacher.exists?(user: existing_student)
    end

    private def update_student_containing_inconsistent_email_and_google_id
      StudentEmailAndGoogleIdUpdater.run(classroom&.owner&.id, email, data[:user_external_id])
    end
  end
end
