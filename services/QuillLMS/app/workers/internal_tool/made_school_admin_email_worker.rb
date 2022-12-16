# frozen_string_literal: true

class InternalTool::MadeSchoolAdminEmailWorker
  include Sidekiq::Worker

  def perform(user_id, school_id)
    @user = User.find_by(id: user_id)
    @school_name = School.find_by(id: school_id)&.name
    @user&.mailer_user&.send_internal_tool_made_school_admin_email(@school_name)

    analytics = Analyzer.new
    analytics.track_with_attributes(
      @user,
      SegmentIo::BackgroundEvents::STAFF_MADE_EXISTING_USER_ADMIN,
      properties: {
        admin_full_name: SegmentIo::Properties::STAFF_USER
      }
    )
  end
end
