# frozen_string_literal: true

module CanvasIntegration
  class ClassroomStudentImporter < ApplicationService
    attr_reader :data, :classroom, :email, :user_external_id

    def initialize(data)
      @data = data
      @classroom = data[:classroom]
      @user_external_id = data[:user_external_id]
      @email = data[:email]
    end

    def run
      assign_classroom
    end

    private def assign_classroom
      ::Associators::StudentsToClassrooms.run(imported_student, classroom)
    end

    private def canvas_account
      @canvas_account ||= ::CanvasAccount.custom_find_by_user_external_id(user_external_id)
    end

    private def existing_student
      return canvas_account.user if canvas_account
      return new_canvas_account.user if student_with_email
    end

    private def imported_student
      existing_student ? StudentUpdater.run(existing_student, data) : StudentCreator.run(data)
    end

    private def new_canvas_account
      @new_canvas_account ||= CanvasAccount.custom_create_by_user_external_id!(user_external_id, student_with_email.id)
    end

    private def student_with_email
      @student_with_email ||= ::User.find_by(email: email) if email.present?
    end
  end
end
