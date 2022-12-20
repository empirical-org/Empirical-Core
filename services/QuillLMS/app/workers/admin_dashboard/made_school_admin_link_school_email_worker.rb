# frozen_string_literal: true

class AdminDashboard::MadeSchoolAdminLinkSchoolEmailWorker
  include Sidekiq::Worker

  def perform(user_id, admin_user_id, school_id)
    @user = User.find_by(id: user_id)
    @admin_name = User.find_by(id: admin_user_id)&.name
    @school = School.find_by(id: school_id)
    @user&.mailer_user&.send_admin_dashboard_made_school_admin_link_school_email(@admin_name, @school)

    analytics = SegmentAnalytics.new
    analytics.track_school_admin_user(
      @user,
      SegmentIo::BackgroundEvents::ADMIN_MADE_EXISTING_USER_ADMIN,
      @school&.name,
      @admin_name
    )
  end
end
