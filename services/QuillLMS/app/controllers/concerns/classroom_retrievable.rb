# frozen_string_literal: true

module ClassroomRetrievable
  extend ActiveSupport::Concern

  include HasProviderNamespace

  included { before_action :teacher! }

  def retrieve_classrooms
    return render json: { reauthorization_required: true } if reauthorization_required?
    return render json: { classrooms: classrooms_data } if serialized_classrooms_data

    hydrate_teacher_classrooms_cache

    render json: { quill_retrieval_processing: true }
  end

  private def classrooms_data
    JSON.parse(serialized_classrooms_data)
  end

  private def hydrate_teacher_classrooms_cache
    provider_namespace::HydrateTeacherClassroomsCacheWorker.perform_async(current_user.id)
  end

  private def serialized_classrooms_data
    @serialized_classrooms_data ||= provider_namespace::TeacherClassroomsCache.read(current_user.id)
  end
end

