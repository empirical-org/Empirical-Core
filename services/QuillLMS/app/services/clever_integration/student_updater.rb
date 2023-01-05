# frozen_string_literal: true

module CleverIntegration
  class StudentUpdater < ApplicationService
    attr_reader :clever_id, :data, :student, :teacher_id, :username

    ACCOUNT_TYPE = ::User::CLEVER_ACCOUNT
    ROLE = ::User::STUDENT

    def initialize(student, data, teacher_id)
      @student = student
      @data = data
      @clever_id = data[:clever_id]
      @teacher_id = teacher_id
      @username = data[:username]
    end

    def run
      fix_disjointed_clever_id_and_email
      fix_username_conflict
      update
      student
    end

    private def clever_id_and_email_disjointed?
      clever_id.present? && student.clever_id != clever_id && ::User.exists?(clever_id: clever_id)
    end

    private def fix_disjointed_clever_id_and_email
      return unless clever_id_and_email_disjointed?

      clever_student = ::User.find_by(clever_id: clever_id)
      student.merge_student_account(clever_student, teacher_id)
      clever_student.update!(clever_id: nil, account_type: 'unknown')
    end

    private def fix_username_conflict
      data.delete(:username) if username_conflict?
    end

    private def student_attrs
      data.merge(account_type: ACCOUNT_TYPE, google_id: nil, role: ROLE, signed_up_with_google: false)
    end

    private def update
      student.update!(student_attrs)
    end

    private def username_conflict?
      username.present? && student.username != username && ::User.exists?(username: username)
    end
  end
end
