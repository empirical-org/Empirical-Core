# frozen_string_literal: true

module QuillBigQuery
  module MaterializedViewable
    extend ActiveSupport::Concern

    included do
      attr_reader :runner
    end

    def initialize(runner: QuillBigQuery::MaterializedViewRunner)
      @runner = runner
    end

    def materialized_view_keys = raise NotImplementedError
    def query = raise NotImplementedError

    def materialized_views
      @materialized_views ||= materialized_view_keys.map{|key| QuillBigQuery::MaterializedView.new(key)}
    end

    def fallback_sql
      "#{fallback_with_clauses} "
    end

    def fallback_with_clauses = materialized_views.map(&:fallback_sql).join(', ')

    def fallback_query_body
      query.
    end
  end
end
