# frozen_string_literal: true

module GoogleIntegration
  class StudentEmailAndGoogleIdUpdater < ApplicationService
    attr_reader :calling_user_id, :email, :google_id

    def initialize(calling_user_id, email, google_id)
      @calling_user_id = calling_user_id
      @email = email
      @google_id = google_id
    end

    def run
      return if email.nil? || google_id.nil? || student.nil?
      return if email_unchanged?

      another_student ? transfer_google_id : update_email
    end

    private def another_student
      @another_student ||= ::User.find_by(email: email)
    end

    private def email_unchanged?
      student.email == email
    end

    private def student
      @student ||= ::User.find_by(google_id: google_id)
    end

    private def transfer_google_id
      GoogleIdTransferrer.run(calling_user_id, student, another_student)
    end

    private def update_email
      student.update!(email: email)

      ChangeLog.create!(
        action: ChangeLog::GOOGLE_IMPORT_ACTIONS[:linked_google_id],
        changed_attribute: :email,
        changed_record: student,
        explanation: caller_locations[0].to_s,
        new_value: email,
        previous_value: student.email,
        user_id: calling_user_id
      )
    end
  end
end
