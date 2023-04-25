# frozen_string_literal: true

class TeacherNotificationSettingsController < ApplicationController

  def activate
    setting = TeacherNotificationSetting.create!(user: current_user, notification_type: params[:notification_type])

    render json: {}
  # A duplicate means that the setting is already activated, so 200
  rescue ActiveRecord::RecordNotUnique
    render json: {}
  rescue ActiveRecord::RecordInvalid => invalid
    render json: {errors: invalid.record.errors.messages}, status: 400
  end

  def deactivate
    TeacherNotificationSetting.find_by(user: current_user, notification_type: params[:notification_type])&.destroy!

    render json: {}
  end
end
