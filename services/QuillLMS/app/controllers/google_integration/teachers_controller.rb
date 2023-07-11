# frozen_string_literal: true

module GoogleIntegration
  class TeachersController < ApplicationController
    before_action :authorize_owner!

    def import_classrooms
      run_student_importer(imported_classroom_ids)
      delete_teacher_classrooms_cache
      hydrate_teacher_classrooms_cache

      render json: { classrooms: current_user.google_classrooms }
    end

    def import_students
      delete_teacher_classrooms_cache
      run_student_importer(selected_classroom_ids)

      render json: { user_id: current_user.id }
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

    private def authorize_owner!
      return unless params[:classroom_id]

      classroom_teacher!(params[:classroom_id])
    end

    private def delete_teacher_classrooms_cache
      GoogleIntegration::TeacherClassroomsCache.delete(current_user.id)
    end

    private def hydrate_teacher_classrooms_cache
      HydrateTeacherClassroomsCacheWorker.perform_async(current_user.id)
    end

    private def imported_classroom_ids
      selected_classrooms_data.map { |data| ClassroomImporter.run(data) }.map(&:id)
    end

    private def run_student_importer(classroom_ids)
      ImportClassroomStudentsWorker.perform_async(current_user.id, classroom_ids)
    end

    private def selected_classroom_ids
      ::Classroom.where(id: params[:classroom_id] || params[:selected_classroom_ids]).ids
    end

    private def selected_classrooms_data
      TeacherClassroomsData.new(current_user, serialized_selected_classrooms_data)
    end

    private def serialized_classrooms_data
      GoogleIntegration::TeacherClassroomsCache.read(current_user.id)
    end

    private def serialized_selected_classrooms_data
      { classrooms: params[:selected_classrooms] }.to_json
    end
  end
end

