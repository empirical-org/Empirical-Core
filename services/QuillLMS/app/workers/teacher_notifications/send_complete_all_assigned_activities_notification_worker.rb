# frozen_string_literal: true

module TeacherNotifications
  class SendCompleteAllAssignedActivitiesNotificationWorker < SendNotificationWorker
    include Sidekiq::Worker

    private def should_send_notification?
      !@activity_session.user.incomplete_assigned_activities
        .where(classrooms: @activity_session.classroom)
        .exists?
    end

    private def notification_type
      StudentCompletedAllAssignedActivities
    end

    private def message_attrs
      {
        student_name: @activity_session.user.name,
        classroom_name: @activity_session.classroom.name
      }
    end
  end
end
