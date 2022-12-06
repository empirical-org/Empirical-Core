# frozen_string_literal: true

class AdminDashboard::AdminAccountCreatedEmailWorker
  include Sidekiq::Worker

  def perform(user_id, admin_user_id, school_id, is_reminder)
    @user = User.find_by(id: user_id)
    @admin_name = User.find_by(id: admin_user_id)&.name
    @school_name = School.find_by(id: school_id)&.name
    @is_reminder = is_reminder
    @user&.mailer_user&.send_admin_dashboard_admin_account_created_email(@admin_name, @school_name, @is_reminder)
  end
end
