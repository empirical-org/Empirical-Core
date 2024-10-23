# frozen_string_literal: true

module GoogleIntegration
  class StudentDataAdapter < ApplicationService
    attr_reader :profile

    def initialize(student_data)
      @profile = student_data.profile
    end

    def run = { email:, first_name:, last_name:, name:, user_external_id: }

    private def email = profile&.email_address&.downcase
    private def first_name = profile&.name&.given_name
    private def last_name = profile&.name&.family_name
    private def name = profile.name.full_name
    private def user_external_id = profile.id
  end
end
