# frozen_string_literal: true

module CleverIntegration
  class TeacherImporter < ApplicationService
    attr_reader :data, :email, :user_external_id

    def initialize(data)
      @data = data
      @email = data[:email]
      @user_external_id = data[:user_external_id]
    end

    def run
      teacher ? TeacherUpdater.run(teacher, data) : TeacherCreator.run(data)
    end

    private def teacher
      teacher_by_user_external_id || teacher_by_email
    end

    private def teacher_by_email
      email && ::User.find_by(email: email)
    end

    private def teacher_by_user_external_id
      user_external_id && ::User.find_by(clever_id: user_external_id)
    end
  end
end
