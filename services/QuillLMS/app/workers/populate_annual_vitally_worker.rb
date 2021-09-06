class PopulateAnnualVitallyWorker
  include Sidekiq::Worker

  USER_ROLES_TO_SYNC = ['teacher', 'admin', 'auditor']

  def perform
    # Don't synchronize non-production data
    return unless ENV['SYNC_TO_VITALLY'] == 'true'

    year_to_sync = Date.today.year - 1.year
    schools_to_sync.each_slice(100) do |school_batch|
      school_ids = school_batch.map { |school| school.id }
      SyncVitallyPastYearAccountsWorker.perform_async(school_ids, year_to_sync)
    end
    users_to_sync.each_slice(100) do |user_batch|
      user_ids = user_batch.map { |user| user.id }
      SyncVitallyPastYearUsersWorker.perform_async(user_ids, year_to_sync)
    end
  end

  def schools_to_sync
    School.select(:id).distinct.joins(:users).where('users.role = ?', 'teacher')
  end

  def users_to_sync
    User.select(:id).joins(:school).where(:role => USER_ROLES_TO_SYNC)
  end
end
