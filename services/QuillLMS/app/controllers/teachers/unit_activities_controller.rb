# frozen_string_literal: true

class Teachers::UnitActivitiesController < ApplicationController
  include QuillAuthentication
  require 'pusher'
  respond_to :json
  before_action :authorize!, :except => ["update_multiple_due_dates"]
  before_action :teacher!
  before_action :set_unit_activities, only: [:update, :hide]
  before_action :set_activity_session, only: :hide

  def update
    @unit_activities.each { |unit_activity| unit_activity&.update(unit_activity_params) }
    render json: @unit_activities.to_json
  end

  def hide
    @unit_activities.update_all(visible: false)
    @unit_activity&.unit&.hide_if_no_visible_unit_activities
    @activity_sessions.update_all(visible: false)
    ResetLessonCacheWorker.new.perform(current_user.id)
    render json: {}
  end

  def update_multiple_due_dates
    base_unit_activities = UnitActivity.where(id: params[:unit_activity_ids])
    activity_ids = base_unit_activities.map(&:activity_id)
    UnitActivity.where(activity_id: activity_ids, unit_id: base_unit_activities.first.unit_id).update_all(due_date: params[:due_date])
    render json: {}
  end

  private def set_activity_session
    activity_ids = @unit_activities.map(&:activity_id).flatten.uniq
    classroom_unit_ids = []
    @unit_activities.each do |ua|
      classroom_unit_ids << ua.unit.classroom_unit_ids
    end
    @activity_sessions = ActivitySession.where(activity: activity_ids, classroom_unit: classroom_unit_ids.flatten.uniq)
  end

  private def set_unit_activities
    @unit_activities = UnitActivity.where(activity: @unit_activity.activity, unit: @unit_activity.unit)
  end

  private def authorize!
    @unit_activity = UnitActivity.find params[:id]
    return unless @unit_activity&.unit&.classrooms
    return if @unit_activity.unit.classrooms.find { |c| c.teacher_ids.include?(current_user.id) }

    auth_failed
  end

  private def unit_activity_params
    params[:unit_activity].permit(:due_date, :due_date_string, :unit_id)
  end
end
