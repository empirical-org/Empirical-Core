# frozen_string_literal: true

class SyncVitallyUsersWorker
  include Sidekiq::Worker

  def perform(user_ids)
    users = User.where(id: user_ids)
    payload = users.map { |user| VitallyIntegration::SerializeVitallySalesUser.new(user).data }
    api = VitallyIntegration::AnalyticsApi.new
    api.batch(payload)
  end
end
