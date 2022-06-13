# frozen_string_literal: true

module CleverIntegration
  class DistrictStudentDataAdapter < ApplicationService
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
      data.id
    end

    private def data
      student_data.data
    end

    private def email
      ::User.valid_email?(data.email) ? data.email.downcase : nil
    end

    private def username
      district_username = data&.credentials&.district_username&.downcase
      return nil if district_username.nil?

      ::User.valid_email?(district_username) ? district_username.split('@').first : district_username
    end

    private def name
      NameBuilder.run(data&.name&.first, data&.name&.last)
    end
  end
end
