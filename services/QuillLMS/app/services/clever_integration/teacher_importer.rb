# frozen_string_literal: true

module CleverIntegration
  class TeacherImporter < ApplicationService
    attr_reader :data, :clever_id, :email

    def initialize(data)
      @data = data
      @clever_id = data[:clever_id]
      @email = data[:email]
    end

    def run
      teacher ? TeacherUpdater.run(teacher, data) : TeacherCreator.run(data)
    end

    private def teacher
      teacher_by_clever_id || teacher_by_email
    end

    private def teacher_by_email
      email && ::User.find_by(email: email)
    end

    private def teacher_by_clever_id
      clever_id && ::User.find_by(clever_id: clever_id)
    end
  end
end
