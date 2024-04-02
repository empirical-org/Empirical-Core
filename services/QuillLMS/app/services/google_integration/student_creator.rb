# frozen_string_literal: true

module GoogleIntegration
  class StudentCreator < ApplicationService
    ACCOUNT_TYPE = ::User::GOOGLE_CLASSROOM_ACCOUNT
    ROLE = ::User::STUDENT
    SIGNED_UP_WITH_GOOGLE = true

    attr_reader :classroom, :email, :first_name, :last_name, :name, :user_external_id

    def initialize(data)
      @classroom = data[:classroom]
      @email = data[:email].downcase
      @name = data[:name]
      @first_name = data[:first_name]
      @last_name = data[:last_name] || ''
      @user_external_id = data[:user_external_id]
    end

    def run
      student
    end

    private def password
      return last_name if last_name.present?

      first_name
    end

    private def student
      ::User.create!(
        account_type: ACCOUNT_TYPE,
        email: email,
        google_id: user_external_id,
        name: name,
        password: password,
        role: ROLE,
        signed_up_with_google: SIGNED_UP_WITH_GOOGLE,
        username: username
      )
    end

    private def username
      ::GenerateUsername.run(first_name, last_name, classroom.code)
    end
  end
end
