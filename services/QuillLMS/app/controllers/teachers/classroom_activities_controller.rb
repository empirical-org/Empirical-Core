class Teachers::ClassroomActivitiesController < ApplicationController
  include QuillAuthentication
  require 'pusher'
  respond_to :json
  before_filter :authorize!, :except => ["lessons_activities_cache", "lessons_units_and_activities", "activity_from_classroom_activity", "update_multiple_due_dates"]
  before_filter :teacher!, :except => ["activity_from_classroom_activity"]
  before_filter :student!, :only => ["activity_from_classroom_activity"]
  before_filter :authorize_student!, :only => ["activity_from_classroom_activity"]
  before_filter :set_classroom_activities, only: [:update, :hide]
  before_filter :set_activity_session, only: :hide

  def update
    @classroom_activities.each{ |classroom_activity| classroom_activity.try(:update_attributes, classroom_activity_params)}
    render json: @classroom_activities.to_json
  end

  def hide
    @classroom_activities.update_all(visible: false)
    @classroom_activity.unit.hide_if_no_visible_unit_activities
    @activity_sessions.update_all(visible: false)
    SetTeacherLessonCache.perform_async(current_user.id)
    render json: {}
  end

  def launch_lesson
    if lesson_tutorial_completed?
      if @classroom_activity.update(locked: false, pinned: true)
        find_or_create_lesson_activity_sessions_for_classroom
        PusherLessonLaunched.run(@classroom_activity.classroom)
        if @classroom_activity.is_valid_for_google_announcement_with_specific_user?(current_user)
          return post_to_google_classroom
        end
        redirect_to lesson_url(lesson) and return
      else
        flash.now[:error] = "We cannot launch this lesson. If the problem persists, please contact support."
        redirect_to :back
      end
    else
      redirect_to "#{ENV['DEFAULT_URL']}/tutorials/lessons?url=#{URI.escape(launch_lesson_url)}" and return
    end
  end

  def activity_from_classroom_activity
    redirect_to "/activity_sessions/#{activity_session_id}/play"
  end

  def lessons_activities_cache
    render json: {
      data: lessons_cache
    }
  end

  def lessons_units_and_activities
    render json: {
      data: get_lessons_units_and_activities
    }
  end

  def update_multiple_due_dates
    base_classroom_activities = ClassroomActivity.where(id: params[:classroom_activity_ids])
    activity_ids = base_classroom_activities.map(&:activity_id)
    ClassroomActivity.where(activity_id: activity_ids, unit_id: base_classroom_activities.first.unit_id).update_all(due_date: params[:due_date])
    render json: {}
  end

private

  def activity_session_id
    @classroom_activity.find_or_create_started_activity_session(current_user.id).id
  end

  def set_activity_session
    @activity_sessions = ActivitySession.where(classroom_activity_id: @classroom_activities.ids)
  end

  def set_classroom_activities
    @classroom_activities = ClassroomActivity.where(activity: @classroom_activity.activity, unit: @classroom_activity.unit)
  end

  def mark_lesson_as_completed
    redirect_to mark_lesson_as_completed_url
  end

  def mark_lesson_as_completed_url
    "#{lesson.classification_form_url}teach/class-lessons/#{lesson.uid}/mark_lesson_as_completed?&classroom_activity_id=#{@classroom_activity.id}"
  end

  def lesson_tutorial_completed?
    @tutorial_completed ||= UserMilestone.exists?(milestone_id: view_lessons_tutorial_milestone.id, user_id: current_user.id)
  end

  def launch_lesson_url
    "/teachers/classroom_activities/#{@classroom_activity.id}/launch_lesson/#{lesson.uid}"
  end

  def lesson
    @lesson ||= Activity.find_by(uid: params['lesson_uid']) || Activity.find_by(id: params['lesson_uid'])
  end

  def view_lessons_tutorial_milestone
    Milestone.find_by(name: 'View Lessons Tutorial')
  end

  def lesson_url(lesson)
    if (ActivitySession.find_by(classroom_activity_id: @classroom_activity.id, state: 'started'))
      "#{lesson.classification_form_url}teach/class-lessons/#{lesson.uid}?&classroom_activity_id=#{@classroom_activity.id}"
    else
      "#{lesson.classification_form_url}customize/#{lesson.uid}?&classroom_activity_id=#{@classroom_activity.id}"
    end
  end

  def post_to_google_classroom
    google_response = GoogleIntegration::Announcements.new(@classroom_activity)
      .post
    if google_response == 'UNAUTHENTICATED'
      session[:google_redirect] = request.path
      return redirect_to '/auth/google_oauth2'
    else
      redirect_to lesson_url(lesson)
    end
  end

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
