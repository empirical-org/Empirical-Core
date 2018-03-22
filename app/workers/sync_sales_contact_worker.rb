class SyncSalesContactWorker
  include Sidekiq::Worker

  def perform(teacher_ids)
    data = []

    teacher_ids.each do |teacher_id|
      data << SerializeSalesContact.new(teacher_id).data
    end

    SalesmachineClient.batch(data)
  end
end
