module CleverIntegration
  class StudentImporter
    attr_reader :data, :clever_id, :email, :username

    def initialize(data)
      @data = data
      @clever_id = data[:clever_id]
      @email = data[:email]
      @username = data[:username]
    end

    def run
      import_student
    end

    private def import_student
      importer_class.new(data).run
    end

    private def importer_class
      existing_student? ? StudentUpdater : StudentCreator
    end

    private def existing_student?
      student_with_email? || student_with_clever_id? || student_with_username?
    end

    private def student_with_email?
      email.present? && ::User.exists?(email: email.downcase)
    end

    private def student_with_clever_id?
      clever_id.present? && ::User.exists?(clever_id: clever_id)
    end

    private def student_with_username?
      username.present? && ::User.exists?(username: username)
    end
  end
end
