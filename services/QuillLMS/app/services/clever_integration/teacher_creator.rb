# frozen_string_literal: true

module CleverIntegration
  class TeacherCreator < ApplicationService
    ACCOUNT_TYPE = ::User::CLEVER_ACCOUNT
    ROLE = ::User::TEACHER

    attr_reader :email, :name, :user_external_id

    def initialize(data)
      @email = data[:email]
      @name = data[:name]
      @user_external_id = data[:user_external_id]
    end

    def run
      ::User.create!(
        account_type: ACCOUNT_TYPE,
        clever_id: user_external_id,
        email: email,
        name: name,
        role: ROLE,
        username: username
      )
    end

    private def username
      UsernameGenerator.run(name)
    end
  end
end
