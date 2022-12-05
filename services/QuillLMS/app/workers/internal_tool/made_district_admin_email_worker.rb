# frozen_string_literal: true

class InternalTool::MadeDistrictAdminEmailWorker
  include Sidekiq::Worker

  def perform(user_id, district_id)
    @user = User.find_by(id: user_id)
    @district_name = District.find_by(id: district_id)&.name
    @user&.mailer_user&.send_internal_tool_made_district_admin_email(@district_name)
  end
end
