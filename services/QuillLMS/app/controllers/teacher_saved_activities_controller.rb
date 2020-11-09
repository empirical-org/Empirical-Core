class TeacherSavedActivitiesController < ApplicationController

  def saved_activity_ids_for_current_user
    activity_ids = TeacherSavedActivity.where(teacher_id: current_user.id).map(&:activity_id)
    render json: { activity_ids: activity_ids }
  end

  def create_by_activity_id_for_current_user
    saved_activity = TeacherSavedActivity.create(activity_id: params[:activity_id], teacher_id: current_user.id)
    render json: saved_activity.to_json, status: 200
  end

  def destroy_by_activity_id_for_current_user
    TeacherSavedActivity.find_by(activity_id: params[:activity_id], teacher_id: current_user.id)&.destroy
    render json: {}, status: 200
  end

end
