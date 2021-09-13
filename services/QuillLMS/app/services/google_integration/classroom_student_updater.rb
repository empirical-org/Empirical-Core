module GoogleIntegration
  class ClassroomStudentUpdater
    ACCOUNT_TYPE = ::User::GOOGLE_CLASSROOM_ACCOUNT
    ROLE = ::User::STUDENT

    attr_reader :email, :google_id

    def initialize(data)
      @email = data[:email].downcase
      @google_id = data[:google_id]
    end

    def run
      update
      student
    end

    private def student
      ::User.find_by!(email: email, role: ROLE)
    end

    private def update
      student.update!(account_type: ACCOUNT_TYPE, google_id: google_id)
    end
  end
end
