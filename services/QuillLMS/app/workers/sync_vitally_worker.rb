# frozen_string_literal: true

class SyncVitallyWorker
  include Sidekiq::Worker

  USER_ROLES_TO_SYNC = ['teacher', 'admin', 'auditor']
  FIRST_DAY_OF_SCHOOL_YEAR_MONTH = 7
  FIRST_DAY_OF_SCHOOL_YEAR_DAY = 1

  # rubocop:disable Metrics/CyclomaticComplexity
  def perform
    if Date.current.month == FIRST_DAY_OF_SCHOOL_YEAR_MONTH && Date.current.day == FIRST_DAY_OF_SCHOOL_YEAR_DAY
      PopulateAnnualVitallyWorker.perform_async
    end
    # Don't synchronize non-production data
    return unless ENV['SYNC_TO_VITALLY'] == 'true'

    schools_to_sync.each_slice(100) do |school_batch|
      school_ids = school_batch.map { |school| school.id }
      SyncVitallyAccountsWorker.perform_async(school_ids)
    end
    users_to_sync.each_slice(100) do |user_batch|
      user_ids = user_batch.map { |user| user.id }
      SyncVitallyUsersWorker.perform_async(user_ids)
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def schools_to_sync
    School.select(:id).distinct.joins(:users).where('users.role = ?', 'teacher')
  end

  def users_to_sync
    User.select(:id).joins(:school).where(:role => USER_ROLES_TO_SYNC)
  end
end
