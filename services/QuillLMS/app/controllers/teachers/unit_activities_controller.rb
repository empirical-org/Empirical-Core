# frozen_string_literal: true

require 'pusher'

class Teachers::UnitActivitiesController < ApplicationController
  respond_to :json

  before_action :authorize!, :except => ["update_multiple_dates"]
  before_action :teacher!
  before_action :set_unit_activities, only: [:update, :hide]
  before_action :set_activity_sessions, only: :hide

  def update
    @unit_activities.each { |unit_activity| unit_activity&.save_new_attributes_and_adjust_dates!(unit_activity_params) }
    render json: @unit_activities.to_json
  end

  def hide
    @unit_activities.update_all(visible: false)
    @unit_activity&.unit&.hide_if_no_visible_unit_activities
    @activity_sessions.update_all(visible: false)
    @unit_activities.each(&:save_user_pack_sequence_items)
    # touch the parent unit in order to clear our caches
    @unit_activity&.unit&.touch
    ResetLessonCacheWorker.new.perform(current_user.id)
    render json: {}
  end

  def update_multiple_dates
    if params[:date_attribute].in?(['publish_date', 'due_date'])
      begin
        ActiveRecord::Base.transaction do
          UnitActivity
            .where(id: params[:unit_activity_ids])
            .each { |ua| ua.save_new_attributes_and_adjust_dates!(params[:date_attribute] => params[:date]) }
        end
      rescue => e
        return render json: { error: "Error updating unit activity. #{e}" }, status: 401
      end
    end

    render json: {}
  end

  private def set_activity_sessions
    activity_ids = @unit_activities.map(&:activity_id).flatten.uniq
    classroom_unit_ids = @unit_activities.map { |ua| ua.unit.classroom_unit_ids }.flatten.uniq
    @activity_sessions = ActivitySession.where(activity: activity_ids, classroom_unit: classroom_unit_ids)
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
    params[:unit_activity].permit(:due_date, :due_date_string, :unit_id, :publish_date)
  end
end
