# frozen_string_literal: true

module GoogleIntegration
  class ClassroomStudentUpdater < ApplicationService
    ACCOUNT_TYPE = ::User::GOOGLE_CLASSROOM_ACCOUNT
    ROLE = ::User::STUDENT

    attr_reader :google_id, :student

    def initialize(student, data)
      @student = student
      @google_id = data[:google_id]
    end

    def run
      update_existing_student_role_if_teacher
      update
      student
    end


    private def update_existing_student_role_if_teacher
      return unless student.teacher?

      student.update(role: ROLE)
      log_role_change
    end

    private def update
      student.update!(account_type: ACCOUNT_TYPE, google_id: google_id)
    end

    private def log_role_change
      ChangeLog.create(
        changed_record: student,
        action: ChangeLog::USER_ACTIONS[:update],
        changed_attribute: :role,
        previous_value: :teacher,
        new_value: :student,
        explanation: caller_locations[0].to_s
      )
    end
  end
end
