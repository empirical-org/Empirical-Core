# frozen_string_literal: true

module CleverIntegration
  class StudentImporter < ApplicationService
    attr_reader :data, :clever_id, :email, :username

    def initialize(data)
      @data = data
      @clever_id = data[:clever_id]
      @email = data[:email]
      @username = data[:username]
    end

    def run
      importer.run
    end

    private def importer
      student ? StudentUpdater.new(student, data) : StudentCreator.new(data)
    end

    private def student
      student_with_email || student_with_clever_id || student_with_username
    end

    private def student_with_email
      ::User.find_by(email: email) if email.present?
    end

    private def student_with_clever_id
      ::User.find_by(clever_id: clever_id) if clever_id.present?
    end

    private def student_with_username
      ::User.find_by(username: username) if username.present?
    end
  end
end
