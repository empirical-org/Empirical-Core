# frozen_string_literal: true

module BigQuery
  class MaterializedViewRefreshWorker
    include Sidekiq::Worker

    def perform(query_key)
      QuillBigQuery::MaterializedViewRefresher.run(query_key)
    end
  end
end
