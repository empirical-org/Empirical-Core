# frozen_string_literal: true

class TeacherInvitedAdminAnalyticsWorker
  include Sidekiq::Worker

  def perform(teacher_id, admin_name, admin_email, note)
    teacher = User.find_by_id(teacher_id)
    analytics = SegmentAnalytics.new
    analytics.track_teacher_invited_admin(teacher, admin_name, admin_email, note)
  end
end
