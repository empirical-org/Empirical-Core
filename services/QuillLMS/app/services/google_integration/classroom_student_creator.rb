# frozen_string_literal: true

module GoogleIntegration
  class ClassroomStudentCreator
    ACCOUNT_TYPE = ::User::GOOGLE_CLASSROOM_ACCOUNT
    ROLE = ::User::STUDENT
    SIGNED_UP_WITH_GOOGLE = true

    attr_reader :classroom, :email, :google_id, :first_name, :last_name, :name

    def initialize(data)
      @classroom = data[:classroom]
      @email = data[:email].downcase
      @google_id = data[:google_id]
      @name = data[:name]
      @first_name = data[:first_name]
      @last_name = data[:last_name]
    end

    def run
      student
    end

    private def password
      last_name
    end

    private def student
      ::User.create!(
        account_type: ACCOUNT_TYPE,
        role: ROLE,
        signed_up_with_google: SIGNED_UP_WITH_GOOGLE,
        email: email,
        google_id: google_id,
        name: name,
        password: password,
        username: username
      )
    end

    private def username
      ::GenerateUsername.run(first_name, last_name, classroom.code)
    end
  end
end
