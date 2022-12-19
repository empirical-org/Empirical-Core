# frozen_string_literal: true

class AdminDashboard::TeacherLinkSchoolEmailWorker
  include Sidekiq::Worker

  def perform(user_id, admin_user_id, school_id)
    @user = User.find_by(id: user_id)
    @admin_name = User.find_by(id: admin_user_id)&.name
    @school = School.find_by(id: school_id)
    @user&.mailer_user&.send_admin_dashboard_teacher_link_school_email(@admin_name, @school)

    analytics = Analyzer.new
    analytics.track_school_admin_user(
      user,
      SegmentIo::BackgroundEvents::ADMIN_SENT_LINK_REQUEST,
      @school&.name,
      @admin_name
    )
  end
end
