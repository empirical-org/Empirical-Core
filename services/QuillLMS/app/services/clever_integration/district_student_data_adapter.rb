# frozen_string_literal: true

module CleverIntegration
  class DistrictStudentDataAdapter < ApplicationService
    attr_reader :student_data

    def initialize(student_data)
      @student_data = student_data
    end

    def run
      {
        email: email,
        name: name,
        user_external_id: user_external_id,
        username: username
      }
    end

    private def data
      student_data.data
    end

    private def email
      ::User.valid_email?(data.email) ? data.email.downcase : nil
    end

    private def name
      NameBuilder.run(data&.name&.first, data&.name&.last)
    end

    private def username
      district_username = data&.credentials&.district_username&.downcase
      return nil if district_username.nil?

      ::User.valid_email?(district_username) ? district_username.split('@').first : district_username
    end

    private def user_external_id
      data.id
    end
  end
end
