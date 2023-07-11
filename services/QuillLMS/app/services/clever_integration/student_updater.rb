# frozen_string_literal: true

module CleverIntegration
  class StudentUpdater < ApplicationService
    ACCOUNT_TYPE = ::User::CLEVER_ACCOUNT
    ROLE = ::User::STUDENT

<<<<<<< HEAD
    attr_reader :data, :student, :temp_username, :user_external_id, :username
=======
    attr_reader :data, :student, :temp_username, :user_external_id
>>>>>>> 9a0c57fd1f (More refactoring of CleverIntegration in preparation for CanvasIntegration)

    def initialize(student, data)
      @student = student
      @data = data
      @temp_username = data[:username]
      @user_external_id = data[:user_external_id]
    end

    def run
<<<<<<< HEAD
      fix_user_external_id_conflict
      fix_username_conflict
=======
      fix_disjointed_user_external_id
>>>>>>> 9a0c57fd1f (More refactoring of CleverIntegration in preparation for CanvasIntegration)
      update_student
      student
    end

<<<<<<< HEAD
    private def fix_user_external_id_conflict
      return unless user_external_id_conflict?

=======
    private def user_external_id_disjointed?
      user_external_id.present? && student.clever_id != user_external_id && ::User.exists?(clever_id: user_external_id)
    end

    private def fix_disjointed_user_external_id
      return unless user_external_id_disjointed?

      teacher_id = data[:classroom]&.owner&.id
>>>>>>> 9a0c57fd1f (More refactoring of CleverIntegration in preparation for CanvasIntegration)
      clever_student = ::User.find_by(clever_id: user_external_id)
      student.merge_student_account(clever_student, teacher_id)
      clever_student.update!(clever_id: nil, account_type: 'unknown')
    end

<<<<<<< HEAD
    private def fix_username_conflict
      if data[:username].blank? || username_conflict?
        @username = student.username
      else
        @username = data[:username]
      end
    end

    private def teacher_id
      data[:classroom]&.owner&.id
    end

    private def update_student
      student.update!(
        account_type: ACCOUNT_TYPE,
        clever_id: user_external_id,
        email: data[:email],
        google_id: nil,
        name: data[:name],
        role: ROLE,
        signed_up_with_google: false,
        username: username
      )
    end

    private def user_external_id_conflict?
      user_external_id.present? && student.clever_id != user_external_id && ::User.exists?(clever_id: user_external_id)
=======
    private def teacher_id
      data[:classroom]&.owner&.id
    end

    private def update_student
      student.update!(
        account_type: ACCOUNT_TYPE,
        clever_id: user_external_id,
        email: data[:email],
        google_id: nil,
        name: data[:name],
        role: ROLE,
        signed_up_with_google: false,
        username: username
      )
    end

    private def username
      return student.username if temp_username.blank? || username_conflict?

      temp_username
>>>>>>> 9a0c57fd1f (More refactoring of CleverIntegration in preparation for CanvasIntegration)
    end

    private def username_conflict?
      student.username != temp_username && ::User.exists?(username: temp_username)
    end
  end
end
