# frozen_string_literal: true

module TeacherNotifications
  class RollupMailer < ApplicationMailer
    include EmailApiHelper
    include ActionView::Helpers::NumberHelper

    FREQUENCY_WORD_LOOKUP = {
      TeacherInfo::HOURLY_EMAIL => 'hour',
      TeacherInfo::DAILY_EMAIL  => 'day',
      TeacherInfo::WEEKLY_EMAIL => 'week'
    }

    TRUNCATE_STUDENT_NAMES_AFTER = 10

    NOTIFICATION_TYPE_PARTIAL_LOOKUP = {
      "TeacherNotifications::StudentCompletedDiagnostic" => "students_completed_diagnostics",
      "TeacherNotifications::StudentCompletedAllDiagnosticRecommendations" => "students_completed_all_diagnostic_recommendations",
      "TeacherNotifications::StudentCompletedAllAssignedActivities" => "students_completed_all_assigned_activities"
    }

    NOTIFICATION_TYPE_SORT_ORDER = [
      TeacherNotifications::StudentCompletedDiagnostic,
      TeacherNotifications::StudentCompletedAllDiagnosticRecommendations,
      TeacherNotifications::StudentCompletedAllAssignedActivities
    ]

    default from: "The Quill Team <hello@quill.org>"

    def rollup(user, teacher_notifications)
      @user = user
      @frequency = FREQUENCY_WORD_LOOKUP[user.teacher_info.notification_email_frequency]

      @teacher_notifications = teacher_notifications.sort_by(&:student_name)
        .sort { |a, b| NOTIFICATION_TYPE_SORT_ORDER.find_index(a.type) <=> NOTIFICATION_TYPE_SORT_ORDER.find_index(b.type) }
      @teacher_notifications = @teacher_notifications.group_by(&:classroom_name).transform_values do |inner_group_by|
        inner_group_by.group_by(&:type)
      end

      subject = "Your Quill #{user.teacher_info.notification_email_frequency} roundup"
      mail(to: @user.email, subject: subject)
    end
  end
end
