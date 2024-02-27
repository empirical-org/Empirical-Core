# frozen_string_literal: true

module QuillBigQuery
  class MaterializedViewQuery < Query
    private def default_runner = QuillBigQuery::MaterializedViewRunner

    def materialized_view_keys = raise NotImplementedError

    def materialized_views
      @materialized_views ||= materialized_view_keys.map{|key| QuillBigQuery::MaterializedView.new(key)}
    end

    def fallback_query
      "#{fallback_with_clauses} #{fallback_query_body}"
    end

    def fallback_with_clauses = materialized_views.map(&:fallback_sql).join(', ')

    private def fallback_query_body
      materialized_views.inject(query) do |query, view|
        query
          .gsub(view.name_with_dataset, view.name_fallback)
          .gsub(view.name, view.name_fallback)
      end
    end
  end
end
