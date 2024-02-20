# frozen_string_literal: true

module QuillBigQuery
  class MaterializedViewRefreshWorker
    include Sidekiq::Worker

    def perform(query_key)
      QuillBigQuery::MaterializedViewRefresher.run(query_key)
    end
  end
end
