class Teachers::UnitActivitiesController < ApplicationController
  include QuillAuthentication
  require 'pusher'
  respond_to :json
  before_filter :authorize!, :except => ["lessons_activities_cache", "lessons_units_and_activities", "update_multiple_due_dates"]
  before_filter :teacher!
  before_filter :set_unit_activities, only: [:update, :hide]
  before_filter :set_activity_session, only: :hide

  def update
    @unit_activities.each{ |unit_activity| unit_activity.try(:update_attributes, unit_activity_params)}
    render json: @unit_activities.to_json
  end

  def hide
    @unit_activities.update_all(visible: false)
    @unit_activity.unit.hide_if_no_visible_unit_activities
    @activity_sessions.update_all(visible: false)
    SetTeacherLessonCache.perform_async(current_user.id)
    render json: {}
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
    base_unit_activities = UnitActivity.where(id: params[:unit_activity_ids])
    activity_ids = base_unit_activities.map(&:activity_id)
    UnitActivity.where(activity_id: activity_ids, unit_id: base_unit_activities.first.unit_id).update_all(due_date: params[:due_date])
    render json: {}
  end

private

  def set_activity_session
    activity_ids = @unit_activities.map(&:activity_id)
    classroom_unit_ids = []
    @unit_activities.each do |ua|
      classroom_unit_ids << ua.unit.classroom_unit_ids
    end
    @activity_sessions = ActivitySession.where(activity: activity_ids, classroom_unit: [classroom_unit_ids.flatten.uniq])
  end

  def set_unit_activities
    @unit_activities = UnitActivity.where(activity: @unit_activity.activity, unit: @unit_activity.unit)
  end

  def lesson_url(lesson, classroom_unit_id)
    if (ActivitySession.find_by(classroom_unit_id: classroom_unit_id, state: 'started'))
      "#{lesson.classification_form_url}teach/class-lessons/#{lesson.uid}?&unit_activity_id=#{@unit_activity.id}"
    else
      "#{lesson.classification_form_url}customize/#{lesson.uid}?&unit_activity_id=#{@unit_activity.id}"
    end
  end

  def post_to_google_classroom
    # this needs to go into unit activity, that's what we'll be passing into this method
    google_response = GoogleIntegration::Announcements.new(@unit_activity)
      .post
    if google_response == 'UNAUTHENTICATED'
      session[:google_redirect] = request.path
      return redirect_to '/auth/google_oauth2'
    else
      redirect_to lesson_url(lesson)
    end
  end

  def authorize!
    @unit_activity = UnitActivity.find params[:id]
    if !@unit_activity.unit.classrooms.find { |c| c.teacher_ids.include?(current_user.id) } then auth_failed end
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

  def unit_activity_params
    params[:unit_activity].permit(:due_date, :due_date_string, :unit_id)
  end
end
