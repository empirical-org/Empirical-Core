# frozen_string_literal: true

module CleverIntegration
  class TeachersController < ::ApplicationController
    include ClassroomImportable
    include ClassroomRetrievable
    include StudentImportable

    private def current_user_classrooms
      current_user.clever_classrooms
    end

    private def reauthorization_required?
      !current_user.clever_authorized?
    end
  end
end

