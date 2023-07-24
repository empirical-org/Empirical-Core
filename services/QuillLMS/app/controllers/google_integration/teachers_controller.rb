# frozen_string_literal: true

module GoogleIntegration
  class TeachersController < ::ApplicationController
    include ClassroomImportable
    include ClassroomRetrievable
    include StudentImportable

    private def current_user_classrooms
      current_user.google_classrooms
    end

    private def reauthorization_required?
      !current_user.google_authorized?
    end
  end
end

