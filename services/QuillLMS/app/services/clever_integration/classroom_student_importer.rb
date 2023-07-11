# frozen_string_literal: true

module CleverIntegration
  class ClassroomStudentImporter < ApplicationService
    attr_reader :data, :classroom, :email, :user_external_id, :username

    def initialize(data)
      @data = data
      @classroom = data[:classroom]
      @email = data[:email]
      @username = data[:username]
      @user_external_id = data[:user_external_id]
    end

    def run
      assign_classroom
    end

    private def assign_classroom
      ::Associators::StudentsToClassrooms.run(imported_student, classroom)
    end

    private def existing_student
      student_with_email || student_with_user_external_id || student_with_username
    end

    private def imported_student
      existing_student ? StudentUpdater.run(existing_student, data) : StudentCreator.run(data)
    end

    private def student_with_email
      ::User.find_by(email: email) if email.present?
    end

    private def student_with_user_external_id
      ::User.find_by(clever_id: user_external_id) if user_external_id.present?
    end

    private def student_with_username
      ::User.find_by(username: username) if username.present?
    end
  end
end
