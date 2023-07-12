# frozen_string_literal: true

module ClassroomImportable
  extend ActiveSupport::Concern

  include HasProviderNamespace

  def import_classrooms
    run_classroom_and_student_importer
    delete_teacher_classrooms_cache
    hydrate_teacher_classrooms_cache

    render json: { classrooms: current_user_classrooms }.to_json
  end

  private def delete_teacher_classrooms_cache
    provider_namespace::TeacherClassroomsCache.delete(current_user.id)
  end

  private def hydrate_teacher_classrooms_cache
    provider_namespace::HydrateTeacherClassroomsCacheWorker.perform_async(current_user.id)
  end

  private def imported_classroom_ids
    selected_classrooms_data
      .map { |data| provider_namespace::ClassroomImporter.run(data) }
      .map(&:id)
  end

  private def run_classroom_and_student_importer
    provider_namespace::ImportTeacherClassroomsStudentsWorker.perform_async(current_user.id, imported_classroom_ids)
  end

  private def selected_classrooms_data
    provider_namespace::TeacherClassroomsData.new(current_user, serialized_selected_classrooms_data)
  end

  private def serialized_selected_classrooms_data
    { classrooms: params[:selected_classrooms] }.to_json
  end
end

