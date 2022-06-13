# frozen_string_literal: true

module CleverIntegration
  class TeacherCreator < ApplicationService
    ACCOUNT_TYPE = ::User::CLEVER_ACCOUNT
    ROLE = ::User::TEACHER

    attr_reader :data, :name

    def initialize(data)
      @data = data
      @name = data[:name]
    end

    def run
      teacher
    end

    private def teacher
      ::User.create!(teacher_attrs)
    end

    private def teacher_attrs
      data.merge(role: ROLE, account_type: ACCOUNT_TYPE, username: username)
    end

    private def username
      UsernameGenerator.new(name).run
    end
  end
end
