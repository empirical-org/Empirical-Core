# frozen_string_literal: true

class InternalTool::MadeSchoolAdminEmailWorker
  include Sidekiq::Worker

  def perform(user_id, school_id)
    user = User.find_by(id: user_id)
    school_name = School.find_by(id: school_id)&.name

    return unless user && school_name

    if user.is_admin_for_one_school?
      user.mailer_user.send_internal_tool_made_school_admin_email(school_name)
    end

    Analytics::SegmentAnalytics.new.track_school_admin_user(
      user,
      Analytics::SegmentIo::BackgroundEvents::STAFF_MADE_EXISTING_USER_SCHOOL_ADMIN,
      school_name,
      Analytics::SegmentIo::Properties::STAFF_USER
    )
  end
end
