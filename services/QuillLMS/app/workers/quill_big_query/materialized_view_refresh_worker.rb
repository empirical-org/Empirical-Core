# frozen_string_literal: true

module QuillBigQuery
  class MaterializedViewRefreshWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    def perform(query_key)
      QuillBigQuery::MaterializedView.new(query_key).refresh!
    end
  end
end
