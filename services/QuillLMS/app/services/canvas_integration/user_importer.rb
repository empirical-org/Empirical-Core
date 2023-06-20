# frozen_string_literal: true

module CanvasIntegration
  class UserImporter < ApplicationService
    attr_reader :email, :external_id, :name, :role, :url

    APPROVED_ROLES = [User::TEACHER, User::STUDENT].freeze
    DEFAULT_ROLE = User::STUDENT

    def initialize(email:, external_id:, name:, role:, url:)
      @email = email
      @external_id = external_id
      @name = name
      @role = role
      @url = url
    end

    def run
      existing_canvas_account_user || new_canvas_account_user
    end

    private def canvas_instance
      @canvas_instance ||= CanvasInstance.find_by!(url: url)
    end

    private def existing_canvas_account_user
      CanvasAccount
        .find_by(external_id: external_id, canvas_instance: canvas_instance)
        &.user
    end

    private def new_canvas_account_user
      # build rather than create is used to satisfy requires_password validation on User
      user
        .canvas_accounts
        .build(canvas_instance: canvas_instance, external_id: external_id)
        .tap(&:save!)
        .user
    end

    private def safe_role
      return role if role.in?(APPROVED_ROLES)

      DEFAULT_ROLE
    end

    private def user
      User.find_by(email: email) || User.new(email: email, name: name, role: safe_role)
    end
  end
end
