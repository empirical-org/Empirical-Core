# frozen_string_literal: true

module CleverIntegration
  class StudentCreator < ApplicationService
    ACCOUNT_TYPE = ::User::CLEVER_ACCOUNT
    ROLE = ::User::STUDENT

    attr_reader :email, :name, :temp_username, :user_external_id

    def initialize(data)
      @email = data[:email]
      @name = data[:name]
      @temp_username = data[:username]
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
      temp_username.present? && ::User.exists?(username: temp_username) ? UsernameGenerator.run(name) : temp_username
    end
  end
end
