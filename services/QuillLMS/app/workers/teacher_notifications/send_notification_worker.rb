# frozen_string_literal: true

module TeacherNotifications
  class SendNotificationWorker
    include Sidekiq::Worker

    def perform(activity_session_id)
      @activity_session = find_activity_session(activity_session_id)
      return unless @activity_session

      TeacherNotification.transaction do
        send_complete_diagnostic
        send_complete_all_diagnostic_recommendations
        send_complete_all_assigned_activities
      end
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

    private def send_complete_diagnostic
      return unless @activity_session.activity.classification.key == ActivityClassification::DIAGNOSTIC_KEY

      send_notification(TeacherNotifications::StudentCompletedDiagnostic, {
        student_name: @activity_session.user.name,
        classroom_name: @activity_session.classroom.name,
        diagnostic_name: @activity_session.activity.name
      })
    end

    private def send_complete_all_diagnostic_recommendations
      unit_template = @activity_session.unit_template
      # Return early if the activity that was just completed wasn't a recommendation
      return if unit_template.nil? || unit_template.recommendations.empty?

      # Return early if the user has never completed a Diagnostic since any activities that they might be assigned can't be from recommendations in that case
      return unless @activity_session.user.activity_sessions
        .joins(activity: :classification)
        .where(activity_classifications: {key: ActivityClassification::DIAGNOSTIC_KEY})
        .count > 0

      # Return early if the user has any incomplete assigned activities that are recommendations
      # Note that if the student has recommendations from two different diagnostics, they have to finish all recommendations from BOTH or this will returrn early
      return if @activity_session.user.incomplete_assigned_activities
        .where("classrooms.id = ?", @activity_session.classroom.id)
        .joins(unit_templates: :recommendations).distinct.count > 0

      send_notification(TeacherNotifications::StudentCompletedAllDiagnosticRecommendations, {
        student_name: @activity_session.user.name,
        classroom_name: @activity_session.classroom.name
      })
    end

    private def send_complete_all_assigned_activities
      return if @activity_session.user.incomplete_assigned_activities
        .where("classrooms.id = ?", @activity_session.classroom.id).count > 0

      send_notification(TeacherNotifications::StudentCompletedAllAssignedActivities, {
        student_name: @activity_session.user.name,
        classroom_name: @activity_session.classroom.name
      })
    end

    private def send_notification(type, message_attrs)
      @activity_session.teachers.each do |teacher|
        type.create!(user: teacher, message_attrs: message_attrs) if teacher_receives_type(teacher, type)
      end
    end

    private def teacher_receives_type(user, type)
      user.teacher_notification_settings.find_by(notification_type: type)
    end
  end
end
