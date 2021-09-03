module GoogleIntegration
  class StudentEmailUpdater
    attr_reader :email, :google_id

    def initialize(data)
      @email = data[:email]&.downcase
      @google_id = data[:google_id]
    end

    def run
      return if email.nil? || google_id.nil? || student.nil?
      return if email_not_changed?
      return if another_user_has_email?

      update_email
    end

    private def another_user_has_email?
      ::User.where(email: email).exists?
    end

    private def email_not_changed?
      student.email == email
    end

    private def student
      @student ||= ::User.find_by(google_id: google_id)
    end

    private def update_email
      student.update(email: email)
    end
  end
end
