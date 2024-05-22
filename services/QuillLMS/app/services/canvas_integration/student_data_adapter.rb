# frozen_string_literal: true

module CanvasIntegration
  class StudentDataAdapter < ApplicationService
    attr_reader :canvas_instance_id, :external_id, :login_id, :name

    def initialize(canvas_instance_id, student_data)
      @canvas_instance_id = canvas_instance_id
      @external_id = student_data[:id]
      @login_id = student_data[:login_id]
      @name = student_data[:name]
    end

    def run
      {
        email: email,
        name: name,
        user_external_id: user_external_id
      }
    end

    private def email
      ::User.valid_email?(login_id) ? login_id.downcase : nil
    end

    private def user_external_id
      ::CanvasAccount.build_user_external_id(canvas_instance_id, external_id)
    end
  end
end
