# frozen_string_literal: true

module CanvasIntegration
  class StudentUpdater < ApplicationService
    ACCOUNT_TYPE = ::User::CANVAS_ACCOUNT
    ROLE = ::User::STUDENT

    attr_reader :data, :initial_email, :student, :temp_email

    def initialize(student, data)
      @student = student
      @data = data
      @initial_email = student.email
      @temp_email = data[:email]
    end

    def run
      update_student
      student
    end

    private def email
      persist_initial_email? ? initial_email : temp_email
    end

    private def name
      data[:name].presence || student.name
    end

    private def persist_initial_email?
      data[:email].blank? || data[:email] == initial_email || ::User.exists?(email: temp_email)
    end

    private def update_student
      student.update!(
        account_type: ACCOUNT_TYPE,
        clever_id: nil,
        email: email,
        google_id: nil,
        name: name,
        role: ROLE,
        signed_up_with_google: false
      )
    end
  end
end
