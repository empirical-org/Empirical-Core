# frozen_string_literal: true

module CleverIntegration
  class TeachersController < ::ApplicationController
    include ClassroomImportable
    include ClassroomRetrievable
    include StudentImportable

    def import_classrooms
      run_student_importer(imported_classroom_ids)
      delete_teacher_classrooms_cache
      hydrate_teacher_classrooms_cache

      render json: { classrooms: current_user.clever_classrooms }
    end

    private def reauthorization_required?
      !current_user.clever_authorized?
    end
  end
end

