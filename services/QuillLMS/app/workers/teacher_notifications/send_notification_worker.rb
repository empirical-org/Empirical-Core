# frozen_string_literal: true

module TeacherNotifications
  class SendNotificationWorker
    include Sidekiq::Worker

    def perform(activity_session_id)
      @activity_session = ActivitySession.find_by(id: user_id)
        .includes(:user)
        .includes(:teachers)
        .includes(:classrooom)
        .includes(activity: :classification)
        .includes(unit_template: :recommendations)
      return unless @activity_session

      send_complete_diagnostic

    end

    private def send_complete_diagnostic
      return unless @activity_session.activity.classification.key == 'diagnostic'

      send_notification(TeacherNotifications::StudentCompletedDiagnostic, {
        student_name: @activity_session.user.name,
        classroom_name: @activity_session.classroom.name,
        diagnostic_name: @activity_session.activity.name
      })
    end

    private def send_complete_all_diagnostic_recommendations
      # Return early if the activity that was just completed wasn't a recommendation
      return if @activity_session.unit_template.recommendations.empty?

      # Return early if the user has any incomplete assigned activities that are recommendations
      # Note that if the student has recommendations from two different diagnostics, they have to finish all recommendations from BOTH or this will returrn early
      return if @activity_session.user.incomplete_assigned_activities
        .joins(unit_templates: :recommendations).distinct.count > 0

      send_notification(TeacherNotifications::StudentCompletedAllDiagnosticRecommendations, {
        student_name: @activity_session.user.name,
        classroom_name: @activity_session.classroom.name
      })
    end

    private def send_complete_all_assignments
      return if @activity_session.user.incomplete_assigned_activities.count > 0

      send_notification(TeacherNotifications::StudentCompletedAllAssignedActivities, {
        student_name: @activity_session.user.name,
        classroom_name: @activity_session.classroom.name
      })
    end

    private def send_notification(type, message_attrrs)
      @activity_session.teachers.each do |teacher|
        type.create!(user: teacher, message_attrs: message_attrs)
      end
    end
  end
end
