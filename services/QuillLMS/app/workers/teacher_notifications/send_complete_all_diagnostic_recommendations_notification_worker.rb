# frozen_string_literal: true

module TeacherNotifications
  class SendCompleteAllDiagnosticRecommendationsNotificationWorker < SendNotificationWorker
    include Sidekiq::Worker

    private def should_send_notification?
      unit_template = @activity_session.unit_template
      # False if the activity that was just completed wasn't a recommendation
      return false unless unit_template&.recommendations&.present?

      # False if the user has never completed a Diagnostic since any activities that they might be assigned can't be from recommendations in that case
      return false unless @activity_session.user.activity_sessions
        .joins(activity: :classification)
        .joins(:classroom)
        .where(activity_classifications: {key: ActivityClassification::DIAGNOSTIC_KEY})
        .where(classrooms: @activity_session.classroom)
        .exists?

      # False if the user has any incomplete assigned activities that are recommendations
      # Note that if the student has recommendations from two different diagnostics, they have to finish all recommendations from BOTH or this will return early
      return false if @activity_session.user.incomplete_assigned_activities
        .joins(unit_templates: :recommendations)
        .where(classrooms: @activity_session.classroom)
        .exists?

      true
    end

    private def notification_type
      StudentCompletedAllDiagnosticRecommendations
    end

    private def message_attrs
      {
        student_name: @activity_session.user.name,
        classroom_name: @activity_session.classroom.name
      }
    end
  end
end
