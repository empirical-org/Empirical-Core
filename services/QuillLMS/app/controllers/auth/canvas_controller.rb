# frozen_string_literal: true

module Auth
  class CanvasController < ApplicationController
    around_action :force_writer_db_role, only: :canvas

    def canvas
      run_background_jobs
      sign_in(user)

      redirect_to profile_path
    end

    private def auth_credential
      @auth_credential ||= CanvasIntegration::AuthCredentialSaver.run(auth_hash)
    end

    private def auth_hash
      request.env['omniauth.auth']
    end

    def run_background_jobs
      return unless user.teacher?

      update_teacher_imported_classrooms
    end

    private def update_teacher_imported_classrooms
      CanvasIntegration::UpdateTeacherImportedClassroomsWorker.perform_async(user.id)
    end

    private def user
      @user ||= auth_credential.user
    end
  end
end
