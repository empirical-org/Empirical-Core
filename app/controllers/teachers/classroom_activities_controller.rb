class Teachers::ClassroomActivitiesController < ApplicationController
  include QuillAuthentication
  require 'pusher'
  respond_to :json
  before_filter :authorize!, :except => ["lessons_activities_cache", "lessons_units_and_activities", "activity_from_classroom_activity", "update_multiple_due_dates"]
  before_filter :teacher!, :except => ["activity_from_classroom_activity"]
  before_filter :student!, :only => ["activity_from_classroom_activity"]
  before_filter :authorize_student!, :only => ["activity_from_classroom_activity"]

  def update
    cas = ClassroomActivity.where(activity: @classroom_activity.activity, unit: @classroom_activity.unit)
    cas.each{ |ca| ca.try(:update_attributes, classroom_activity_params)}
    render json: cas.to_json
  end

  def hide
    cas = ClassroomActivity.where(activity_id: @classroom_activity.activity_id, unit_id: @classroom_activity.unit_id)
    activity_sessions = ActivitySession.where(classroom_activity_id: cas.ids)
    cas.update_all(visible: false)
    SetTeacherLessonCache.perform_async(current_user.id)
    activity_sessions.update_all(visible: false)
    @classroom_activity.unit.hide_if_no_visible_classroom_activities
    render json: {}
  end

  def launch_lesson
    milestone = Milestone.find_by(name: 'View Lessons Tutorial')
    completed = UserMilestone.find_by(milestone_id: milestone.id, user_id: current_user.id)
    lesson = Activity.find_by(uid: params['lesson_uid']) || Activity.find_by(id: params['lesson_uid'])
    base_route = lesson.classification.form_url
    if (ActivitySession.find_by(classroom_activity_id: @classroom_activity.id, state: 'started'))
      lesson_url = "#{base_route}teach/class-lessons/#{lesson.uid}?&classroom_activity_id=#{@classroom_activity.id}"
    else
      lesson_url = "#{base_route}customize/#{lesson.uid}?&classroom_activity_id=#{@classroom_activity.id}"
    end
    if completed
      unlocked = @classroom_activity.update(locked: false, pinned: true)
      if unlocked
        find_or_create_lesson_activity_sessions_for_classroom
        PusherLessonLaunched.run(@classroom_activity.classroom)
        redirect_to lesson_url
      else
        flash.now[:error] = "We cannot launch this lesson. If the problem persists, please contact support."
      end
    else
      launch_lesson_url = "/teachers/classroom_activities/#{@classroom_activity.id}/launch_lesson/#{lesson.uid}"
      redirect_to "#{ENV['DEFAULT_URL']}/tutorials/lessons?url=#{URI.escape(launch_lesson_url)}"
    end
  end

  def mark_lesson_as_completed
    lesson = Activity.find_by(uid: params['lesson_uid']) || Activity.find_by(id: params['lesson_uid'])
    base_route = lesson.classification.form_url
    mark_lesson_as_completed_url = "#{base_route}teach/class-lessons/#{lesson.uid}/mark_lesson_as_completed?&classroom_activity_id=#{@classroom_activity.id}"
    redirect_to mark_lesson_as_completed_url
  end


  def activity_from_classroom_activity
    act_sesh_id = @classroom_activity.find_or_create_started_activity_session(current_user.id).id
    redirect_to "/activity_sessions/#{act_sesh_id}/play"
  end

  def lessons_activities_cache
    render json: {data: lesson_cache}
  end

  def lessons_units_and_activities
    render json: {data: get_lessons_units_and_activities}
  end

  def update_multiple_due_dates
    base_classroom_activities = ClassroomActivity.where(id: params[:classroom_activity_ids])
    activity_ids = base_classroom_activities.map(&:activity_id)
    ClassroomActivity.where(activity_id: activity_ids, unit_id: base_classroom_activities.first.unit_id).update_all(due_date: params[:due_date])
    render json: {}
  end

private

  def find_or_create_lesson_activity_sessions_for_classroom
    @classroom_activity.assigned_student_ids.each{|id| ActivitySession.unscoped.find_or_create_by(classroom_activity_id: @classroom_activity.id, activity_id: @classroom_activity.activity_id, user_id: id).update(visible: true)}
  end

  def authorize!
    @classroom_activity = ClassroomActivity.find params[:id]
    if @classroom_activity.classroom.teacher_ids.exclude?(current_user.id) then auth_failed end
  end

  def authorize_student!
    @classroom_activity = ClassroomActivity.find params[:id]
    if current_user.classrooms.exclude?(@classroom_activity.classroom) then auth_failed end
  end

  def get_lessons_units_and_activities
    # collapses lessons cache into unique array of activity ids
    grouped_lessons_cache = lessons_cache.group_by{|ca| {activity_id: ca['activity_id'], name: ca['activity_name'], completed: ca['completed']}}
    grouped_lessons_cache.keys.select { |lesson| lesson[:completed] == false }
  end

  def lessons_cache
    lessons_cache = $redis.get("user_id:#{current_user.id}_lessons_array")
    if lessons_cache
      JSON.parse(lessons_cache)
    else
      current_user.set_and_return_lessons_cache_data
    end
  end

  def classroom_activity_params
    params[:classroom_activity].permit(:due_date, :due_date_string, :choose_everyone, {assigned_student_ids: []}, :unit_id)
  end
end
