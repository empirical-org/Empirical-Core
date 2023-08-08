# frozen_string_literal: true

module GoogleIntegration
  class StudentDataAdapter < ApplicationService
    attr_reader :profile

    def initialize(student_data)
      @profile = student_data.profile
    end

    def run
      {
        email: email,
        first_name: first_name,
        last_name: last_name,
        name: name,
        user_external_id: user_external_id
      }
    end

    private def email
      profile.email_address.downcase
    end

    private def first_name
      profile&.name&.given_name
    end

    private def last_name
      profile&.name&.family_name
    end

    private def name
      profile.name.full_name
    end

    private def user_external_id
      profile.id
    end
  end
end
