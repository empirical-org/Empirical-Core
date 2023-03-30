# frozen_string_literal: true

class AdminReceivedAdminUpgradeRequestFromTeacherAnalyticsWorker
  include Sidekiq::Worker

  def perform(admin_id, teacher_id, reason, new_user)
    analytics = SegmentAnalytics.new
    admin = User.find_by_id(admin_id)
    teacher = User.find_by_id(teacher_id)
    analytics.track_admin_received_admin_upgrade_request_from_teacher(admin, teacher, reason, new_user)
  end
end
