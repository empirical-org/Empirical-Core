# frozen_string_literal: true

class PremiumHub::TeacherAccountCreatedEmailWorker
  include Sidekiq::Worker

  def perform(user_id, admin_user_id, school_id, is_reminder)
    user = User.find_by(id: user_id)
    admin_name = User.find_by(id: admin_user_id)&.name
    school_name = School.find_by(id: school_id)&.name

    return unless user && admin_name && school_name

    user.mailer_user.send_premium_hub_teacher_account_created_email(admin_name, school_name, is_reminder)

    Analytics::SegmentAnalytics.new.track_school_admin_user(
      user,
      Analytics::SegmentIo::BackgroundEvents::ADMIN_CREATED_TEACHER_ACCOUNT,
      school_name,
      admin_name
    )
  end
end
