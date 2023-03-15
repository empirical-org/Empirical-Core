# frozen_string_literal: true

class AdminInvitedByTeacherAnalyticsWorker
  include Sidekiq::Worker

  def perform(admin_name, admin_email, teacher_id, note)
    teacher = User.find_by_id(teacher_id)
    analytics = SegmentAnalytics.new
    analytics.track_admin_invited_by_teacher(admin_name, admin_email, teacher, note)
  end
end
