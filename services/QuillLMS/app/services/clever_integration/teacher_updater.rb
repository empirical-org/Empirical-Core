# frozen_string_literal: true

module CleverIntegration
  class TeacherUpdater < ApplicationService
    attr_reader :data, :teacher

    ACCOUNT_TYPE = ::User::CLEVER_ACCOUNT
    ROLE = ::User::TEACHER

    def initialize(teacher, data)
      @teacher = teacher
      @data = data
    end

    def run
      update
      teacher
    end

    private def teacher_attrs
      data.merge(account_type: ACCOUNT_TYPE, google_id: nil, role: ROLE, signed_up_with_google: false)
    end

    private def update
      teacher.update!(teacher_attrs)
    end
  end
end
