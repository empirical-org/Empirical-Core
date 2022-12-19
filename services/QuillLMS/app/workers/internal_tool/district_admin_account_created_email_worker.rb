# frozen_string_literal: true

class InternalTool::DistrictAdminAccountCreatedEmailWorker
  include Sidekiq::Worker

  def perform(user_id, district_id)
    @user = User.find_by(id: user_id)
    @district_name = District.find_by(id: district_id)&.name
    @user&.mailer_user&.send_internal_tool_district_admin_account_created_email(@district_name)

    analytics = Analyzer.new
    analytics.track_district_admin_user(
      user,
      SegmentIo::BackgroundEvents::STAFF_CREATED_DISTRICT_ADMIN_ACCOUNT,
      @district_name,
      SegmentIo::Properties::STAFF_USER
    )
  end
end
