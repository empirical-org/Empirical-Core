# frozen_string_literal: true

module QuillBigQuery
  class MaterializedViewQuery < Query

    BROKEN_MATERIALIZED_VIEW_ERRORS = [
      ::Google::Cloud::NotFoundError,
      ::Google::Cloud::InvalidArgumentError
    ]

    # Array of string keys defined by child
    def materialized_view_keys = raise NotImplementedError

    def run_query
      query_runner(query)
    rescue *BROKEN_MATERIALIZED_VIEW_ERRORS
      query_runner(query_fallback)
    end

    private def query_runner(query)
      post_query_transform(runner.execute(query))
    end

    def materialized_views
      @materialized_views ||= materialized_view_keys.map {|key| QuillBigQuery::MaterializedView.new(key)}
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
      materialized_views.inject(query) do |query, view|
        query
          .gsub(view.name_with_dataset, view.name_fallback)
          .gsub(view.name, view.name_fallback)
      end
    end
  end
end
