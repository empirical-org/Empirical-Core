# frozen_string_literal: true

class InternalTool::AdminAccountCreatedEmailWorker
  include Sidekiq::Worker

  def perform(user_id, school_id)
    user = User.find_by(id: user_id)
    school_name = School.find_by(id: school_id)&.name

    return unless user && school_name

    user.mailer_user.send_internal_tool_admin_account_created_email(school_name)

    Analytics::SegmentAnalytics.new.track_school_admin_user(
      user,
      Analytics::SegmentIo::BackgroundEvents::STAFF_CREATED_SCHOOL_ADMIN_ACCOUNT,
      school_name,
      Analytics::SegmentIo::Properties::STAFF_USER
    )
  end
end
