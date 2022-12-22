# frozen_string_literal: true

class AdminDashboard::TeacherAccountCreatedEmailWorker
  include Sidekiq::Worker

  def perform(user_id, admin_user_id, school_id, is_reminder)
    user = User.find_by(id: user_id)
    admin_name = User.find_by(id: admin_user_id)&.name
    school_name = School.find_by(id: school_id)&.name
    is_reminder = is_reminder

    return unless user && admin_name && school_name

    user.mailer_user.send_admin_dashboard_teacher_account_created_email(admin_name, school_name, is_reminder)

    SegmentAnalytics.new.track_school_admin_user(
      user,
      SegmentIo::BackgroundEvents::ADMIN_CREATED_TEACHER_ACCOUNT,
      school_name,
      admin_name
    )
  end
end
