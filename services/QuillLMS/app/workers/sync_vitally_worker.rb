# frozen_string_literal: true

class SyncVitallyWorker
  include Sidekiq::Worker

  USER_ROLES_TO_SYNC = ['teacher', 'admin', 'auditor']
  FIRST_DAY_OF_SCHOOL_YEAR_MONTH = 7
  FIRST_DAY_OF_SCHOOL_YEAR_DAY = 1
  # We actually have a 1000/minute rate limit, but we can play it safe
  ORGANIZATION_RATE_LIMIT_PER_MINUTE = 950

  # rubocop:disable Metrics/CyclomaticComplexity
  def perform
    today = Date.current
    if today.month == FIRST_DAY_OF_SCHOOL_YEAR_MONTH && today.day == FIRST_DAY_OF_SCHOOL_YEAR_DAY
      PopulateAnnualVitallyWorker.perform_async
    end
    # Don't synchronize non-production data
    return unless ENV['SYNC_TO_VITALLY'] == 'true'

    districts_to_sync.each_slice(ORGANIZATION_RATE_LIMIT_PER_MINUTE).with_index do |slice, index|
      slice.each do |district|
        # Our rate limit resets every 60 seconds, but we use a two minute
        # delay to ensure that we don't run into clock differences between
        # our servers and Vitally's
        delay = (2 * index)
        SyncVitallyOrganizationWorker.perform_in(delay.minutes, district.id)
      end
    end
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
    @schools_to_sync ||= School.select(:id, :district_id).distinct.joins(:users).where('users.role = ?', 'teacher')
  end

  def users_to_sync
    User.select(:id).joins(:school).where(:role => USER_ROLES_TO_SYNC)
  end

  def districts_to_sync
    schools_to_sync.map(&:district).compact.uniq
  end
end
