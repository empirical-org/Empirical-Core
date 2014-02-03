class Teachers::ClassroomChaptersController < ApplicationController
  before_filter :teacher!
  before_filter :authorize!

  def show
    @classroom_activity.due_date ||= Time.now
  end

  def update
    @classroom_activity.attributes = classroom_activity_params
    @classroom_activity.save
    redirect_to teachers_classroom_lesson_planner_path(@classroom)
  end

  def destroy
    @classroom_activity.destroy
    redirect_to teachers_classroom_lesson_planner_path(@classroom)
  end

private

  def authorize!
    @classroom = Classroom.where(teacher_id: current_user.id).find(params[:classroom_id])
    @activity = Activity.find(params[:id])
    @classroom_activity = AssignmentView.find_or_initialize_by(activity_id: @activity.id, classroom_id: @classroom.id)
  end

  def classroom_activity_params
    params[:classroom_activity].permit(:due_date, :due_date_string, :choose_everyone, {assigned_student_ids: []}, :unit_id)
  end
end
