# frozen_string_literal: true

module Gengo
  class SaveJobsFromOrderWorker
    include Sidekiq::Worker

    sidekiq_options queue: SidekiqQueue::LOW

    def perform(order_id)
      SaveJobsFromOrder.run(order_id)
    end
  end
end
