# frozen_string_literal: true

class MaterializedViewRefreshWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW
  MATVIEWS = [
    'feedback_histories_grouped_by_rule_uid'
  ]
  def perform
    MATVIEWS.each do |matview|
      ActiveRecord::Base.refresh_materialized_view(matview)
    end
  end
end
