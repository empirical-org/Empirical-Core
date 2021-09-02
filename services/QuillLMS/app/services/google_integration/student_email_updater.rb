module GoogleIntegration
  class StudentEmailUpdater
    attr_reader :email, :google_id

    def initialize(data)
      @email = data[:email]&.downcase
      @google_id = data[:google_id]
    end

    def run
      return if invalid_email?
      return if invalid_google_id?
      return if student_not_found?
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

    private def invalid_email?
      email.nil?
    end

    private def invalid_google_id?
      google_id.nil?
    end

    private def student_not_found?
      student.nil?
    end

    private def student
      @student ||= ::User.find_by(google_id: google_id)
    end

    private def update_email
      student.update(email: email)
    end
  end
end
