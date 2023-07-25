# frozen_string_literal: true

class PremiumHub::TeacherLinkSchoolEmailWorker
  include Sidekiq::Worker

  def perform(user_id, admin_user_id, school_id)
    user = User.find_by(id: user_id)
    admin_name = User.find_by(id: admin_user_id)&.name
    school = School.find_by(id: school_id)

    return unless user && admin_name && school

    user.mailer_user.send_premium_hub_teacher_link_school_email(admin_name, school)

    Analytics::SegmentAnalytics.new.track_school_admin_user(
      user,
      Analytics::SegmentIo::BackgroundEvents::ADMIN_SENT_LINK_REQUEST,
      school.name,
      admin_name
    )
  end
end
