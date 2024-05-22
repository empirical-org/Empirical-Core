# frozen_string_literal: true

module TeacherNotifications
  class SendCompleteDiagnosticNotificationWorker < SendNotificationWorker
    include Sidekiq::Worker


    private def should_send_notification?
      @activity_session.activity.is_diagnostic?
    end

    private def notification_type
      StudentCompletedDiagnostic
    end

    private def message_attrs
      {
        student_name: @activity_session.user.name,
        classroom_name: @activity_session.classroom.name,
        diagnostic_name: @activity_session.activity.name
      }
    end
  end
end
