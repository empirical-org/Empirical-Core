class Teachers::ClassroomActivitiesController < ApplicationController
  include QuillAuthentication
  respond_to :json

  before_filter :teacher!
  before_filter :authorize!


  def update
    @classroom_activity.update_attributes due_date: params[:due_date]
    render json: {}
  end

  def destroy
    @classroom_activity.destroy
    render json: {}
  end

private

  def authorize!
    @classroom_activity = ClassroomActivity.find params[:id]
    if @classroom_activity.classroom.teacher != current_user then auth_failed end
  end

  def classroom_activity_params
    params[:classroom_activity].permit(:due_date, :due_date_string, :choose_everyone, {assigned_student_ids: []}, :unit_id)
  end
end
