# frozen_string_literal: true

module BigQuery
  class RefreshMaterializedViewWorker
    include Sidekiq::Worker

    QUERY_FOLDER = Rails.root + 'db/big_query/views/'
    CONFIG = Configs[:big_query_views]

    def perform(query_key)
      debugger
      QuillBigQuery::Runner.execute(drop_sql(query_key))

      QuillBigQuery::Runner.execute(create_sql(query_key))
    end

    private def drop_sql(query_key) = sql_for(query_key, :drop)
    private def create_sql(query_key) = sql_for(query_key, :create)

    private def sql_for(query_key, action)
      File.read(QUERY_FOLDER + CONFIG[query_key][action])
    end
  end
end
