# frozen_string_literal: true

module CleverIntegration
  class TeachersController < ApplicationController
    def import_classrooms
      run_classroom_and_student_importer
      delete_teacher_classrooms_cache
      hydrate_teacher_classrooms_cache

      render json: { user_id: current_user.id }
    end

    def import_students
      delete_teacher_classrooms_cache
      run_student_importer

      render json: { user_id: current_user.id }
    end

    def retrieve_classrooms
      if !current_user.clever_authorized?
        render json: { user_id: current_user.id, reauthorization_required: true }
      elsif serialized_classrooms_data
        render json: {
          classrooms_data: JSON.parse(serialized_classrooms_data),
          existing_clever_ids: existing_clever_ids
        }
      else
        hydrate_teacher_classrooms_cache
        render json: { user_id: current_user.id, quill_retrieval_processing: true }
      end
    end

    private def classrooms_data
      TeacherClassroomsData.new(current_user, serialized_classrooms_data)
    end

    private def delete_teacher_classrooms_cache
      TeacherClassroomsCache.delete(current_user.id)
    end

    private def existing_clever_ids
      ::Classroom.unscoped.where(clever_id: classrooms_data.clever_ids).pluck(:clever_id)
    end

    private def hydrate_teacher_classrooms_cache
      HydrateTeacherClassroomsCacheWorker.perform_async(current_user.id)
    end

    private def imported_classrooms
      selected_classrooms_data.map { |data| ClassroomImporter.run(data) }
    end

    private def run_classroom_and_student_importer
      ImportClassroomStudentsWorker.perform_async(current_user.id, imported_classrooms.map(&:id))
    end

    private def run_student_importer
      ImportClassroomStudentsWorker.perform_async(current_user.id, selected_classroom_ids)
    end

    private def selected_classroom_ids
      ::Classroom.where(id: params[:selected_classroom_ids]).ids
    end

    private def selected_classrooms_data
      TeacherClassroomsData.new(current_user, serialized_selected_classrooms_data)
    end

    private def serialized_classrooms_data
      TeacherClassroomsCache.read(current_user.id)
    end

    private def serialized_selected_classrooms_data
      { classrooms: params[:selected_classrooms] }.to_json
    end
  end
end

