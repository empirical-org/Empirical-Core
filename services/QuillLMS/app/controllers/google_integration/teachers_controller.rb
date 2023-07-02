# frozen_string_literal: true

module GoogleIntegration
  class TeachersController < ApplicationController
    def import_students
      delete_teacher_classrooms_cache
      run_student_importer
      render json: { id: current_user.id }
    end

    def retrieve_classrooms
      if !current_user.google_authorized?
        render json: { user_id: current_user.id, reauthorization_required: true }
      elsif serialized_classrooms_data
        render json: JSON.parse(serialized_classrooms_data)
      else
        hydrate_teacher_classrooms_cache
        render json: { user_id: current_user.id, quill_retrieval_processing: true }
      end
    end

    private def delete_teacher_classrooms_cache
      GoogleIntegration::TeacherClassroomsCache.delete(current_user.id)
    end

    private def hydrate_teacher_classrooms_cache
      GoogleIntegration::HydrateTeacherClassroomsCacheWorker.perform_async(current_user.id)
    end

    private def run_student_importer
      GoogleIntegration::ImportClassroomStudentsWorker.perform_async(current_user.id, selected_classroom_ids)
    end

    private def selected_classroom_ids
      Classroom.where(id: params[:classroom_id] || params[:selected_classroom_ids]).ids
    end

    private def serialized_classrooms_data
      GoogleIntegration::TeacherClassroomsCache.read(current_user.id)
    end
  end
end

