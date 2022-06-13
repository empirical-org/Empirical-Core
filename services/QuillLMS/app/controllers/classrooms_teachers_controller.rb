# frozen_string_literal: true

class ClassroomsTeachersController < ApplicationController
  before_action :signed_in!
  before_action :multi_classroom_auth, only: :update_coteachers

  def edit_coteacher_form
    redirect_to teachers_classrooms_path
  end

  def update_coteachers
    begin
      coteacher = User.find(params[:classrooms_teacher_id].to_i)
      coteacher.handle_negative_classrooms_from_update_coteachers(@classrooms[:negative_classroom_ids])
      coteacher.handle_positive_classrooms_from_update_coteachers(@classrooms[:positive_classroom_ids], current_user.id)
    rescue => e
      return render json: { error_message: e }, status: 422
    end
    render json: {message: 'Update Succeeded!'}
  end

  def remove_coteacher
    coteacher = User.find(params[:classrooms_teacher_id])
    coteacher.handle_negative_classrooms_from_update_coteachers([params[:classroom_id]])
    render json: {}
  end

  def update_order
    JSON.parse(params[:updated_classrooms]).each do |updated_classroom|
      current_user
        .classrooms_teachers
        .find_by(classroom_id: updated_classroom['id'])
        &.update(order: updated_classroom['order'])
    end

    classrooms = ClassroomsTeacher.where(user_id: current_user.id)
    render json: { classrooms: classrooms }
  end

  def specific_coteacher_info
    render json: { selectedTeachersClassroomIds: edit_info_for_specific_teacher(params[:coteacher_id])}
  end

  def destroy
    begin
      ClassroomsTeacher.find_by(user_id: current_user.id, classroom_id: params[:classroom_id]).destroy
    rescue => e
      return render json: { error_message: e }, status: 422
    end
    render json: {message: 'Deletion Succeeded!'}
  end

  private def multi_classroom_auth
    @classrooms = params[:classrooms]
    uniqued_classroom_ids = @classrooms[:negative_classroom_ids].concat(@classrooms[:positive_classroom_ids]).uniq
    ClassroomsTeacher.where(user_id: current_user.id, classroom_id: uniqued_classroom_ids, role: 'owner').length == uniqued_classroom_ids.length
  end

  private def edit_info_for_specific_teacher(selected_teacher_id)
    {
      is_coteacher: current_user.classrooms_i_own_that_a_specific_user_coteaches_with_me(selected_teacher_id).map(&:id),
      invited_to_coteach: current_user.classroom_ids_i_have_invited_a_specific_teacher_to_coteach(selected_teacher_id)
    }
  end

end
