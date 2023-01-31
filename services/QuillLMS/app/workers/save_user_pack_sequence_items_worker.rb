# frozen_string_literal: true

class SaveUserPackSequenceItemsWorker
  include Sidekiq::Worker

  sidekiq_options queue: SidekiqQueue::DEFAULT,
    lock: :until_executed,
    on_conflict: :log,
    lock_ttl: 2.minutes

  def perform(classroom_id, user_id)
    return if classroom_id.nil? || user_id.nil?
    return unless Classroom.unscoped.exists?(id: classroom_id) && User.exists?(id: user_id)

    UserPackSequenceItemSaver.run(classroom_id, user_id)
  end
end

