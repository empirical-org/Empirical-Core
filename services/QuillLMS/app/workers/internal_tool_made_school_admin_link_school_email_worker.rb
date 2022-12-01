# frozen_string_literal: true

class InternalToolMadeSchoolAdminLinkSchoolEmailWorker
  include Sidekiq::Worker

  def perform(user_id, school_id)
    @user = User.find_by(id: user_id)
    @school = School.find_by(id: school_id)
    @user.send_internal_tool_made_school_admin_link_school_email(@school)
  end
end
