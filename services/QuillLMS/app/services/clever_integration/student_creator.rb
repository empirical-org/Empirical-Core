# frozen_string_literal: true

module CleverIntegration
  class StudentCreator < ApplicationService
    ACCOUNT_TYPE = ::User::CLEVER_ACCOUNT
    ROLE = ::User::STUDENT

    attr_reader :data, :name, :username

    def initialize(data)
      @data = data
      @name = data[:name]
      @username = data[:username]
    end

    def run
      fix_username_conflict
      student
    end

    private def student
      ::User.create!(student_attrs)
    end

    private def student_attrs
      data.merge(role: ROLE, account_type: ACCOUNT_TYPE)
    end

    private def fix_username_conflict
      return unless username.present? && ::User.exists?(username: username)

      data[:username] = UsernameGenerator.new(name).run
    end
  end
end
