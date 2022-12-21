# frozen_string_literal: true

class InternalTool::MadeSchoolAdminLinkSchoolEmailWorker
  include Sidekiq::Worker

  def perform(user_id, school_id)
    @user = User.find_by(id: user_id)
    @school = School.find_by(id: school_id)

    return unless @user && @school

    @user.mailer_user.send_internal_tool_made_school_admin_link_school_email(@school)

    analytics = SegmentAnalytics.new
    analytics.track_school_admin_user(
      @user,
      SegmentIo::BackgroundEvents::STAFF_MADE_EXISTING_USER_ADMIN,
      @school.name,
      SegmentIo::Properties::STAFF_USER
    )
  end
end
