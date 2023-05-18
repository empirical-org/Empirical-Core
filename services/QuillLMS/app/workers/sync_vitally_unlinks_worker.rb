# frozen_string_literal: true

class SyncVitallyUnlinksWorker
  include Sidekiq::Worker

  def perform(user_id, school_id)
    api = VitallyApi.new
    api.unlink({
      userId: user_id,
      accountId: school_id
    })
  end
end
