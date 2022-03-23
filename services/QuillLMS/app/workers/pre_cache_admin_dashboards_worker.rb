# frozen_string_literal: true

class PreCacheAdminDashboardsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::DEFAULT

  def perform()
    active_admins = User.where('last_sign_in >= ?', School.school_year_start(Time.now)).joins(:schools_admins).all

    active_admins.each do |user|
      FindAdminUsersWorker.perform_async(user.id)
    end
  end
end
