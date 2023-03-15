# frozen_string_literal: true

class SyncVitallyWorker
  include Sidekiq::Worker

  USER_ROLES_TO_SYNC = ['teacher', 'admin', 'auditor']

  # Note, We have a 1000/minute rate limit, spacing these out to stay under
  # Note, batch size has a limit of 100, staying just under that
  BATCH_SIZE = 99

  def perform
    # Don't synchronize non-production data
    return unless ENV['SYNC_TO_VITALLY'] == 'true'

    queue_district_syncs
    queue_school_syncs
    queue_user_syncs
  end

  private def queue_district_syncs
    # ~12.5 K of these
    districts_to_sync.find_each.with_index do |district, index|
      SyncVitallyOrganizationWorker.perform_in(index.seconds, district.id)
    end
  end

  private def queue_school_syncs
    # ~55K of these, ~550 batches
    schools_to_sync.find_in_batches(batch_size: BATCH_SIZE).with_index do |schools, index|
      SyncVitallyAccountsWorker.perform_in(index.seconds, schools.map(&:id))
    end
  end

  private def queue_user_syncs
    # ~275K of these, ~2,750 batches
    users_to_sync.find_in_batches(batch_size: BATCH_SIZE).with_index do |users, index|
      SyncVitallyUsersWorker.perform_in(index.seconds, users.map(&:id))
    end
  end

  private def schools_to_sync
    @schools_to_sync ||= school_query
  end

  private def school_query
    School
      .select(:id, :district_id)
      .distinct
      .joins(:users)
      .merge(User.teacher) # adds the User scope :teacher to the query
  end

  private def users_to_sync
    User
      .select(:id)
      .joins(:school)
      .where(role: USER_ROLES_TO_SYNC)
  end

  private def districts_to_sync
    District
      .where(id: district_ids)
      .distinct
  end

  private def district_ids
    schools_to_sync
      .map(&:district_id)
      .compact
      .uniq
  end
end
