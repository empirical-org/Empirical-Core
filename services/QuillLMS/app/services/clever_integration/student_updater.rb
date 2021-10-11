module CleverIntegration
  class StudentUpdater
    attr_reader :clever_id, :data, :email, :student, :username

    ACCOUNT_TYPE = ::User::CLEVER_ACCOUNT
    ROLE = ::User::STUDENT

    def initialize(data)
      @data = data
      @clever_id = data[:clever_id]
      @email = data[:email]
      @username = data[:username]
    end

    def run
      set_student
      fix_disjointed_clever_id_and_email
      fix_username_conflict
      update
      student
    end

    private def clever_id_and_email_disjointed?
      clever_id.present? && student.clever_id != clever_id && User.exists?(clever_id: clever_id)
    end

    private def fix_disjointed_clever_id_and_email
      return unless clever_id_and_email_disjointed?

      clever_student = User.find_by(clever_id: clever_id)
      student.merge_student_account(clever_student)
      clever_student.update!(clever_id: nil, account_type: 'unknown')
    end

    private def fix_username_conflict
      data[:username] = nil if username_conflict?
    end

    private def set_student
      if email.present? && User.exists?(email: email)
        @student = User.find_by(email: email)
      elsif clever_id.present? && User.exists?(clever_id: clever_id)
        @student = User.find_by(clever_id: clever_id)
      else
        @student = User.find_by(username: username)
      end
    end

    private def update
      student.update!(data.merge(account_type: ACCOUNT_TYPE, role: ROLE, signed_up_with_google: false))
    end

    private def username_conflict?
      username.present? && student.username != username && User.exists?(username: username)
    end
  end
end
