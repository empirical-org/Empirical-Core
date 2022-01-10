# frozen_string_literal: true

module CleverIntegration
  class TeachersController < ApplicationController
    def import_classrooms
      run_classroom_importer
      delete_teacher_classrooms_cache
      hydrate_teacher_classrooms_cache

      render json: { classrooms: current_user.clever_classrooms }.to_json
    end

    private def delete_teacher_classrooms_cache
      TeacherClassroomsCache.delete(current_user.id)
    end

    private def hydrate_teacher_classrooms_cache
      HydrateTeacherClassroomsCacheWorker.perform_async(current_user.id)
    end

    private def run_classroom_importer
      selected_classrooms_data.each { |data| ClassroomImporter.run(data) }
    end

    private def selected_classrooms_data
      TeacherClassroomsData.new(current_user, serialized_selected_classrooms_data)
    end

    private def serialized_selected_classrooms_data
      { classrooms: params[:selected_classrooms] }.to_json
    end
  end
end
