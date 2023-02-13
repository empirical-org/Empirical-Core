# frozen_string_literal: true

class PopulateAnnualVitallyWorker
  include Sidekiq::Worker

  USER_ROLES_TO_SYNC = ['teacher', 'admin', 'auditor']

  def perform
    # Don't synchronize non-production data
    return unless ENV['SYNC_TO_VITALLY'] == 'true'

    year_to_sync = School.school_year_start(Date.current - 1.year).year
    schools_to_sync.each_slice(100) do |school_batch|
      school_ids = school_batch.map(&:id)
      SyncVitallyPastYearAccountsWorker.perform_async(school_ids, year_to_sync)
    end
    users_to_sync.each_slice(100) do |user_batch|
      user_ids = user_batch.map(&:id)
      SyncVitallyPastYearUsersWorker.perform_async(user_ids, year_to_sync)
    end
  end

  def schools_to_sync
    School.select(:id).distinct.joins(:users).merge(User.teacher)
  end

  def users_to_sync
    User.select(:id).joins(:school).where(:role => USER_ROLES_TO_SYNC)
  end
end
