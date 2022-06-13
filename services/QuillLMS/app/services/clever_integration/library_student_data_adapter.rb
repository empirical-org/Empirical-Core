# frozen_string_literal: true

module CleverIntegration
  class LibraryStudentDataAdapter < ApplicationService
    attr_reader :student_data

    def initialize(student_data)
      @student_data = student_data
    end

    def run
      {
        clever_id: clever_id,
        email: email,
        name: name,
        username: username
      }
    end

    private def clever_id
      data[:id]
    end

    private def data
      @data ||= student_data['data'].deep_symbolize_keys
    end

    private def email
      ::User.valid_email?(data[:email]) ? data[:email].downcase : nil
    end

    private def name
      ::NameBuilder.run(data.dig(:name, :first), data.dig(:name, :last))
    end

    private def username
      data[:id].downcase
    end
  end
end
