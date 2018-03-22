class SyncSalesAccountWorker
  include Sidekiq::Worker

  def perform(school_ids)
    data = []

    school_ids.each do |school_id|
      data << SerializeSalesAccount.new(school_id).data
    end

    SalesmachineClient.batch(data)
  end
end
