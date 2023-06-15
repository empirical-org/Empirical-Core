# frozen_string_literal: true

module Auth
  class CanvasController < ApplicationController
    around_action :force_writer_db_role, only: :canvas

    def canvas
      sign_in(user)
      redirect_to profile_path
    end

    private def auth_hash
      request.env['omniauth.auth']
    end

    private def user
      CanvasIntegration::UserImporter.run(auth_hash, session.delete(:role))
    end
  end
end
