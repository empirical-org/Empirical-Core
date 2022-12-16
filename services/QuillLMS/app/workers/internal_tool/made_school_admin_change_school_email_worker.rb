# frozen_string_literal: true

class InternalTool::MadeSchoolAdminChangeSchoolEmailWorker
  include Sidekiq::Worker

  def perform(user_id, new_school_id, existing_school_id)
    @user = User.find_by(id: user_id)
    @new_school = School.find_by(id: new_school_id)
    @existing_school = School.find_by(id: existing_school_id)
    @user&.mailer_user&.send_internal_tool_made_school_admin_change_school_email(@new_school, @existing_school)

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
