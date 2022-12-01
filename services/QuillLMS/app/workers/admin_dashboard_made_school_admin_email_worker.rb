# frozen_string_literal: true

class AdminDashboardMadeSchoolAdminEmailWorker
  include Sidekiq::Worker

  def perform(user_id, admin_user_id, school_id)
    @user = User.find_by(id: user_id)
    @admin_name = User.find_by(id: admin_user_id)&.name
    @school_name = School.find_by(id: school_id)&.name
    @user.send_admin_dashboard_made_school_admin_email(@admin_name, @school_name)
  end
end
