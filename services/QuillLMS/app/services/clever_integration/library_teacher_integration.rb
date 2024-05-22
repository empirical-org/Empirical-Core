# frozen_string_literal: true

module CleverIntegration
  class LibraryTeacherIntegration < ApplicationService
    attr_reader :teacher, :token

    def initialize(teacher, token)
      @teacher = teacher
      @token = token
    end

    def run
      save_auth_credential
    end

    private def save_auth_credential
      AuthCredentialSaver.run(
        access_token: token,
        auth_credential_class: CleverLibraryAuthCredential,
        user: teacher
      )
    end
  end
end
