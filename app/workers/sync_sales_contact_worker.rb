class SyncSalesContactWorker
  include Sidekiq::Worker

  def perform(redis_key)
    ids = $redis.lrange(redis_key, 0, 99)

    return if ids.blank?

    data  = []
    count = 0
    ids.each do |id|
      sale_contact_serializer = SerializeSalesContact.new(id)

      data << sale_contact_serializer.data
      if sale_contact_serializer.account_data.present?
        data << sale_contact_serializer.account_data
        count += 1
      end
    end
    response = SalesmachineClient.batch(data)

    if response.success?
      $redis.ltrim(redis_key, (100 - count), -1)
      SyncSalesContactWorker.perform_async(redis_key)
    else
      raise response.status.to_s
    end
  end
end
