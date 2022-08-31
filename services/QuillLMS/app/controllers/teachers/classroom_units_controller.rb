# frozen_string_literal: true

require 'pusher'

class Teachers::ClassroomUnitsController < ApplicationController
  respond_to :json

  around_action :force_writer_db_role, only: [:launch_lesson]

  before_action :authorize!, except: [
    :lessons_activities_cache,
    :lessons_units_and_activities
  ]
  before_action :teacher!
  before_action :lesson, only: :launch_lesson

  def launch_lesson
    begin
      @unit_activity = UnitActivity.find_by(
        unit_id: @classroom_unit.unit_id,
        activity: @lesson.id
      )
      cuas = ClassroomUnitActivityState.find_or_create_by(
        classroom_unit: @classroom_unit,
        unit_activity: @unit_activity
      )
    rescue ActiveRecord::StatementInvalid
      flash.now[:error] = "We cannot launch this lesson. If the problem persists, please contact support."
      redirect_back(fallback_location: dashboard_teachers_classrooms_path)
      return
    end

    # rubocop:disable Style/GuardClause
    if lesson_tutorial_completed?
      if cuas && cuas.update(locked: false, pinned: true)
        find_or_create_lesson_activity_sessions_for_classroom
        PusherLessonLaunched.run(@classroom_unit.classroom)
        redirect_to lesson_url(lesson) and return
      else
        flash.now[:error] = "We cannot launch this lesson. If the problem persists, please contact support."
        redirect_back(fallback_location: dashboard_teachers_classrooms_path)
      end
    else
      redirect_to "#{ENV['DEFAULT_URL']}/tutorials/lessons?url=#{URI.encode_www_form_component(launch_lesson_url)}" and return
    end
    # rubocop:enable Style/GuardClause
  end

  def lessons_activities_cache
    render json: {
      data: lessons_cache
    }
  end

  def lessons_units_and_activities
    render json: {
      data: lessons_units_and_activities_data
    }
  end

  def mark_lesson_as_completed
    redirect_to mark_lesson_as_completed_url
  end

  private def set_activity_session
    @activity_sessions = ActivitySession.where(classroom_unit_id: @classroom_units.ids)
  end

  private def set_classroom_units
    @classroom_units = ClassroomUnit.where(activity: @classroom_unit.activity, unit: @classroom_unit.unit)
  end

  private def mark_lesson_as_completed_url
    "#{lesson.classification_form_url}teach/class-lessons/#{lesson.uid}/mark_lesson_as_completed?&classroom_unit_id=#{@classroom_unit.id}"
  end

  private def lesson_tutorial_completed?
    @tutorial_completed ||= UserMilestone.exists?(milestone_id: view_lessons_tutorial_milestone.id, user_id: current_user.id)
  end

  private def launch_lesson_url
    "/teachers/classroom_units/#{@classroom_unit.id}/launch_lesson/#{lesson.uid}"
  end

  private def lesson
    @lesson ||= Activity.find_by(uid: params['lesson_uid']) || Activity.find_by(id: params['lesson_uid'])
  end

  private def view_lessons_tutorial_milestone
    Milestone.find_by(name: 'View Lessons Tutorial')
  end

  private def lesson_url(lesson)
    if ActivitySession.find_by(classroom_unit_id: @classroom_unit.id, state: 'started')
      "#{lesson.classification_form_url}teach/class-lessons/#{lesson.uid}?&classroom_unit_id=#{@classroom_unit.id}"
    else
      "#{lesson.classification_form_url}customize/#{lesson.uid}?&classroom_unit_id=#{@classroom_unit.id}"
    end
  end

  private def find_or_create_lesson_activity_sessions_for_classroom
    @classroom_unit.assigned_student_ids.each{|id| ActivitySession.unscoped.find_or_create_by(classroom_unit_id: @classroom_unit.id, activity_id: @lesson.id, user_id: id).update(visible: true)}
  end

  private def authorize!
    @classroom_unit = ClassroomUnit.find_by(id: params[:id])
    if !current_user || @classroom_unit.classroom.teacher_ids.exclude?(current_user.id) then auth_failed end
  end

  private def lessons_units_and_activities_data
    # collapses lessons cache into unique array of activity ids
    grouped_lessons_cache = lessons_cache.group_by{|ca| {activity_id: ca['activity_id'], name: ca['activity_name'], completed: ca['completed'], visible: ca['visible']}}
    grouped_lessons_cache.keys.select { |lesson| !lesson[:completed] && lesson[:visible] }
  end

  private def lessons_cache
    lessons_cache = $redis.get("user_id:#{current_user.id}_lessons_array")
    if lessons_cache
      JSON.parse(lessons_cache)
    else
      current_user.set_and_return_lessons_cache_data
    end
  end

  private def classroom_unit_params
    params[:classroom_unit].permit(:choose_everyone, {assigned_student_ids: []}, :unit_id)
  end
end
