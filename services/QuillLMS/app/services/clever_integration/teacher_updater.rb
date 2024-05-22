# frozen_string_literal: true

module CleverIntegration
  class TeacherUpdater < ApplicationService
    ACCOUNT_TYPE = ::User::CLEVER_ACCOUNT
    DEFAULT_ROLE = ::User::TEACHER

    attr_reader :email, :name, :teacher, :user_external_id

    def initialize(teacher, data)
      @teacher = teacher
      @email = data[:email]
      @name = data[:name]
      @user_external_id = data[:user_external_id]
    end

    def run
      update
      teacher
    end

    private def role
      return @teacher.role if User::TEACHER_INFO_ROLES.include?(@teacher.role)

      DEFAULT_ROLE
    end

    def update
      teacher.update!(
        account_type: ACCOUNT_TYPE,
        clever_id: user_external_id,
        google_id: nil,
        email: email,
        name: name,
        role: role,
        signed_up_with_google: false
      )
    end
  end
end
