# frozen_string_literal: true

module QuillBigQuery
  class MaterializedViewQuery < Query
    class BrokenMaterializedViewError < StandardError; end

    BROKEN_MATERIALIZED_VIEW_ERRORS = [
      ::Google::Cloud::NotFoundError,
      ::Google::Cloud::InvalidArgumentError
    ]

    # Array of uillBigQuery::MaterializedView defined by child
    def materialized_views = raise NotImplementedError

    def materialized_view(key)
      @materialized_views ||= {}
      @materialized_views[key] ||= QuillBigQuery::MaterializedView.new(key)
    end

    def run_query
      query_runner(query)
    rescue *BROKEN_MATERIALIZED_VIEW_ERRORS => e
      ErrorNotifier.report(BrokenMaterializedViewError.new(e.message))
      query_runner(query_fallback)
    end

    private def query_runner(query)
      post_query_transform(runner.execute(query))
    end

    def query_fallback
      <<-SQL.squish
        WITH
        #{query_fallback_with_clauses}
        #{query_fallback_body}
      SQL
    end

    private def query_fallback_with_clauses = materialized_views.map(&:fallback_with_clause).join(', ')

    private def query_fallback_body
      materialized_views.inject(query.gsub('WITH ', ', ')) do |query, view|
        query
          .gsub(view.name_with_dataset, view.name_fallback)
          .gsub(view.name, view.name_fallback)
      end
    end
  end
end
