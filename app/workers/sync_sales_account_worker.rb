class SyncSalesAccountWorker
  include Sidekiq::Worker

  def perform(redis_key)
    ids = $redis.lrange(redis_key, 0, 99)

    return if ids.blank?

    data = []
    ids.each { |id| data << SerializeSalesAccount.new(id).data }
    response = SalesmachineClient.batch(data)

    if response.success?
      $redis.ltrim(redis_key, 100, -1)
      SyncSalesAccountWorker.perform_async(redis_key)
    else
      raise response.status.to_s
    end
  end
end
