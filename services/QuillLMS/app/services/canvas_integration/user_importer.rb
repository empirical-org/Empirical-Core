# frozen_string_literal: true

module CanvasIntegration
  class UserImporter < ApplicationService
    attr_reader :canvas_user_external_id, :email, :info, :name, :role, :url

    def initialize(auth_hash, role)
      @canvas_user_external_id = auth_hash[:uid]
      @info = auth_hash[:info]
      @email = info[:email]
      @name = info[:name]
      @url = info[:url]
      @role = role
    end

    def run
      existing_canvas_account_user || new_canvas_account_user
    end

    private def canvas_instance
      @canvas_instance ||= CanvasInstance.find_by!(url: url)
    end

    private def existing_canvas_account_user
      CanvasAccount
        .find_by(external_id: canvas_user_external_id, canvas_instance: canvas_instance)
        &.user
    end

    private def new_canvas_account_user
      user
        .canvas_accounts
        .build(canvas_instance: canvas_instance, external_id: canvas_user_external_id)
        .tap(&:save!)
        .user
    end

    private def user
      User.find_by(email: email) || User.new(email: email, name: name, role: role)
    end
  end
end
