# frozen_string_literal: true

module QuillBigQuery
  class MaterializedViewQuery < Query

    private def default_runner = QuillBigQuery::MaterializedViewRunner

    def materialized_view_keys = raise NotImplementedError

    def run_query
      post_query_transform(runner.run(query, query_fallback))
    end

    def materialized_views
      @materialized_views ||= materialized_view_keys.map{|key| QuillBigQuery::MaterializedView.new(key)}
    end

    def query_fallback
      "#{query_fallback_with_clauses} #{query_fallback_body}"
    end

    def query_fallback_with_clauses = materialized_views.map(&:fallback_sql).join(', ')

    private def query_fallback_body
      materialized_views.inject(query) do |query, view|
        query
          .gsub(view.name_with_dataset, view.name_fallback)
          .gsub(view.name, view.name_fallback)
      end
    end
  end
end
