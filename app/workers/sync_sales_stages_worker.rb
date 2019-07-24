class SyncSalesStagesWorker
  include Sidekiq::Worker

  def perform(redis_key)
    ids = $redis.lrange(redis_key, 0, 99)

    return if ids.blank?

    data = []
    ids.each do |id|
      serializer = SerializeSalesContact.new(id)
      if serializer.account_data.present?
        data << serializer.account_data
      end
    end

    response = begin
      if data.present?
        SalesmachineClient.batch(data)
      end
    end

    if response.blank? || response.success?
      $redis.ltrim(redis_key, 100, -1)
      SyncSalesStagesWorker.perform_async(redis_key)
    else
      raise response.status.to_s
    end
  end
end
