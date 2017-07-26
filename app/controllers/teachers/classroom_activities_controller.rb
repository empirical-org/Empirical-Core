class Teachers::ClassroomActivitiesController < ApplicationController
  include QuillAuthentication
  require 'pusher'
  respond_to :json

  before_filter :teacher!
  # skip_before_filter :lessons_activities_cache
  before_filter :authorize!, :except => ["lessons_activities_cache"]


  def update
    cas = ClassroomActivity.where(activity: @classroom_activity.activity, unit: @classroom_activity.unit)
    cas.each{ |ca| ca.try(:update_attributes, classroom_activity_params)}
    render json: cas.to_json
  end

  def destroy
    # cas = @classroom_activity.unit.classroom_activities.where(activity: @classroom_activity.activity)
    # cas.each{|ca| ca.destroy}
    # @classroom_activity.unit.hide_if_no_visible_classroom_activities
    # render json: {}
  end

  def hide
    @classroom_activity.update(visible: false)
    @classroom_activity.unit.hide_if_no_visible_classroom_activities
    render json: {}
  end


  def unlock_lesson
    unlocked = @classroom_activity.update(locked: false, pinned: true)
    PusherLessonLaunched.run(@classroom_activity.classroom)
    render json: {unlocked: unlocked}
  end

  def lessons_activities_cache
    data = JSON.parse($redis.get("user_id:#{current_user.id}_lessons_array") || '[]')
    render json: {data: data}
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
