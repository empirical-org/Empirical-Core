# frozen_string_literal: true

module TeacherNotifications
  class SendNotificationWorker
    include Sidekiq::Worker

    attr_accessor :activity_session

    def perform(activity_session_id)
      @activity_session = find_activity_session(activity_session_id)
      return unless @activity_session
      return unless should_send_notification?

      send_notification(notification_type, message_attrs)
    end

    private def should_send_notification?
      raise NotImplementedError
    end

    private def notification_type
      raise NotImplementedError
    end

    private def message_attrs
      raise NotImplementedError
    end

    private def find_activity_session(activity_session_id)
      ::ActivitySession.where(id: activity_session_id)
        .where.not(completed_at: nil)
        .includes(:user)
        .includes(teachers: :teacher_notification_settings)
        .includes(:classroom)
        .includes(activity: :classification)
        .includes(unit_template: :recommendations)
        .first
    end

    private def send_notification(type, message_attrs)
      @activity_session.teachers.each do |teacher|
        type.create!(user: teacher, message_attrs: message_attrs) if teacher_receives_type?(teacher, type)
      end
    end

    private def teacher_receives_type?(user, type)
      user.receives_notification_type?(type)
    end
  end
end
