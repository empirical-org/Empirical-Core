# frozen_string_literal: true

module Auth
  class CanvasController < ApplicationController
    around_action :force_writer_db_role, only: :canvas

    def canvas
      hydrate_teacher_classrooms_cache if user.teacher?
      sign_in(user)

      redirect_to profile_path
    end

    private def auth_credential
      @auth_credential ||= CanvasIntegration::AuthCredentialSaver.run(auth_hash)
    end

    private def auth_hash
      request.env['omniauth.auth']
    end

    private def hydrate_teacher_classrooms_cache
      CanvasIntegration::TeacherClassroomsCacheHydrator.run(user)
    end

    private def user
      @user ||= auth_credential.user
    end
  end
end
