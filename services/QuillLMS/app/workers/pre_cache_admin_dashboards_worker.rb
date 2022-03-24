# frozen_string_literal: true

class PreCacheAdminDashboardsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::DEFAULT

  def perform
    active_admin_ids = User.where('last_sign_in >= ?', School.school_year_start(Time.now)).joins(:schools_admins).pluck(:id)

    active_admin_ids.each do |id|
      FindAdminUsersWorker.perform_async(id)
    end
  end
end
