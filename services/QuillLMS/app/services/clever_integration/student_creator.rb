# frozen_string_literal: true

module CleverIntegration
  class StudentCreator < ApplicationService
    ACCOUNT_TYPE = ::User::CLEVER_ACCOUNT
    ROLE = ::User::STUDENT

    attr_reader :email, :name, :user_external_id, :username

    def initialize(data)
      @email = data[:email]
      @name = data[:name]
      @user_external_id = data[:user_external_id]
      @username = data[:username]
    end

    def run
      fix_username_conflict
      create_student
    end

    private def create_student
      ::User.create!(
        account_type: ACCOUNT_TYPE,
        clever_id: user_external_id,
        email: email,
        name: name,
        role: ROLE,
        username: username
      )
    end

    private def fix_username_conflict
      return unless username.present? && ::User.exists?(username: username)

      @username = UsernameGenerator.run(name)
    end
  end
end
