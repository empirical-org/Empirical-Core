# frozen_string_literal: true

module GoogleIntegration
  class TeachersController < ApplicationController
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

    private def hydrate_teacher_classrooms_cache
      GoogleIntegration::HydrateTeacherClassroomsCacheWorker.perform_async(current_user.id)
    end

    private def serialized_classrooms_data
      GoogleIntegration::TeacherClassroomsCache.read(current_user.id)
    end
  end
end

