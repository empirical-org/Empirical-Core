# frozen_string_literal: true

module CanvasIntegration
  class StudentCreator < ApplicationService
    ACCOUNT_TYPE = ::User::CANVAS_ACCOUNT
    ROLE = ::User::STUDENT

    attr_reader :canvas_instance_id, :data, :email, :external_id, :name

    def initialize(data)
      @email = data[:email]
      @name = data[:name]
      @canvas_instance_id, @external_id = CanvasAccount.unpack_user_external_id!(data[:user_external_id])
    end

    def run
      student
    end

    private def student
      ::User.create!(
        account_type: ACCOUNT_TYPE,
        email: email,
        name: name,
        role: ROLE,
        canvas_accounts_attributes: [
          {
            canvas_instance_id: canvas_instance_id,
            external_id: external_id
          }
        ]
      )
    end
  end
end


