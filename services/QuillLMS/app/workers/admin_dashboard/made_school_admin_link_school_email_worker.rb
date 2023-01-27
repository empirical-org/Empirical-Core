# frozen_string_literal: true

class AdminDashboard::MadeSchoolAdminLinkSchoolEmailWorker
  include Sidekiq::Worker

  def perform(user_id, admin_user_id, school_id)
    user = User.find_by(id: user_id)
    admin_name = User.find_by(id: admin_user_id)&.name
    school = School.find_by(id: school_id)

    return unless user && admin_name && school

    if SchoolsAdmins.where(user_id: user_id).count == 1
      user.mailer_user.send_admin_dashboard_made_school_admin_link_school_email(admin_name, school)
    end

    SegmentAnalytics.new.track_school_admin_user(
      user,
      SegmentIo::BackgroundEvents::ADMIN_MADE_EXISTING_USER_SCHOOL_ADMIN,
      school.name,
      admin_name
    )
  end
end
