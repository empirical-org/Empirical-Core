# frozen_string_literal: true

module GoogleIntegration
  class StudentUpdater < ApplicationService
    ACCOUNT_TYPE = ::User::GOOGLE_CLASSROOM_ACCOUNT
    ROLE = ::User::STUDENT

    attr_reader :student, :user_external_id

    def initialize(student, data)
      @student = student
      @user_external_id = data[:user_external_id]
    end

    def run
      update_existing_student_role_if_teacher
      update_student
      student
    end

    private def update_existing_student_role_if_teacher
      return unless student.teacher?

      student.update(role: ROLE)
      log_role_change
    end

    private def update_student
      student.update!(
        account_type: ACCOUNT_TYPE,
        clever_id: nil,
        google_id: user_external_id
      )
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
