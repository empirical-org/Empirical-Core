# frozen_string_literal: true

module CanvasIntegration
  class TeachersController < ::ApplicationController
    include ClassroomImportable
    include ClassroomRetrievable
    include StudentImportable

    private def current_user_classrooms
      current_user.canvas_classrooms
    end

    private def reauthorization_required?
      !current_user.canvas_authorized?
    end
  end
end

