class SyncVitallyUsersWorker
  include Sidekiq::Worker

  def perform(user_ids)
    users = User.where(id: user_ids)
    payload = users.map { |user| SerializeVitallySalesUser.new(user).data }
    api = VitallyApi.new
    api.batch(payload)
  end
end
