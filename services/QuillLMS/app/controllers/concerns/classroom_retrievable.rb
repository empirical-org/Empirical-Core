# frozen_string_literal: true

module ClassroomRetrievable
  extend ActiveSupport::Concern

  def retrieve_classrooms
    return render json: { user_id: current_user.id, reauthorization_required: true } if reauthorization_required?
    return render json: serialized_classrooms_data if serialized_classrooms_data

    hydrate_teacher_classrooms_cache
    render json: { user_id: current_user.id, quill_retrieval_processing: true }
  end

  private def hydrate_teacher_classrooms_cache
    provider_namespace::HydrateTeacherClassroomsCacheWorker.perform_async(current_user.id)
  end

  private def provider_namespace
    self.class.module_parent
  end

  private def serialized_classrooms_data
    provider_namespace::TeacherClassroomsCache.read(current_user.id)
  end
end

