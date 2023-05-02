# frozen_string_literal: true

class Api::V1::TeacherNotificationSettingsController < ApplicationController
  before_action :set_current_settings, only: [:index, :bulk_update]

  def index
    render json: types_and_values
  end

  def bulk_update
    TeacherNotificationSetting.transaction do
      teacher_notification_setting_params.each do |notification_type, active|
        # Convert the string to a boolean so that 'false' is treated as false
        active = ActiveModel::Type::Boolean.new.cast(active)

        # Create settings that are in the payload params but not in the database
        if active
          # Skip notification_types that are already set
          next if @current_settings.exists?(notification_type: notification_type)

          TeacherNotificationSetting.create!(user: current_user, notification_type: notification_type)
        else
          # Destroy settings that are not in the payload params
          @current_settings.find_by(notification_type: notification_type)&.destroy!
        end
      end
    end

    render json: types_and_values
  rescue ActiveRecord::RecordNotDestroyed, ActiveRecord::RecordInvalid => e
    render json: { errors: e }, status: 400
  end

  private def types_and_values
    {
      teacher_notification_settings: TeacherNotificationSetting.notification_types.to_h do |notification_type|
        [notification_type, @current_settings.exists?(notification_type: notification_type)]
      end
    }
  end


  private def set_current_settings
    @current_settings = TeacherNotificationSetting.where(user: current_user)
  end

  private def teacher_notification_setting_params
    params.require(:notification_types).permit(*TeacherNotificationSetting.notification_types)
  end
end
