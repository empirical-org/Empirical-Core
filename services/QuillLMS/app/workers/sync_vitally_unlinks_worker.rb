# frozen_string_literal: true

class SyncVitallyUnlinksWorker
  include Sidekiq::Worker

  def perform(user_id, school_id)
    api = VitallyIntegration::Api.new
    api.unlink({
      userId: user_id,
      accountId: school_id,
      timestamp: DateTime.current
    })
  end
end
