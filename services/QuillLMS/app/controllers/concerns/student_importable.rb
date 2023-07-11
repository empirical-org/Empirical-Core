# frozen_string_literal: true

module StudentImportable
  extend ActiveSupport::Concern

  included { before_action :authorize_owner! }

  def import_students
    run_student_importer
    delete_teacher_classrooms_cache

    render json: { user_id: current_user.id }
  end

  private def authorize_owner!
    params[:classroom_id] && classroom_teacher!(params[:classroom_id])
  end

  private def delete_teacher_classrooms_cache
    provider_namespace::TeacherClassroomsCache.delete(current_user.id)
  end

  private def provider_namespace
    self.class.module_parent
  end

  private def run_student_importer
    provider_namespace::ImportTeacherClassroomsStudentsWorker.perform_async(current_user.id, selected_classroom_ids)
  end

  private def selected_classroom_ids
    ::Classroom.where(id: params[:classroom_id] || params[:selected_classroom_ids]).ids
  end
end

