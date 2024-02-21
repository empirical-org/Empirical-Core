# frozen_string_literal: true

module QuillBigQuery
  class Query < ::ApplicationService
    attr_reader :runner

    def initialize(runner: QuillBigQuery::Runner)
      @runner = runner
    end

    def run
      raise NotImplementedError
    end

    def post_query_transform(query_result)
      query_result
    end

    def run_query
      post_query_transform(runner.execute(query))
    rescue Google::Cloud::NotFoundError, Google::Cloud::InvalidArgumentError => e
      raise unless materialized_views_used.any? { |view_name| e.message.include?(view_name) }

      post_query_transform(runner.execute(query_without_materialized_views))
    end

    def query
      root_query
    end

    def root_query
      <<-SQL
        #{select_clause}
        #{from_and_join_clauses}
        #{where_clause}
        #{group_by_clause}
        #{order_by_clause}
        #{limit_clause}
      SQL
    end

    def select_clause
      raise NotImplementedError
    end

    def group_by_clause
      ""
    end

    def order_by_clause
      ""
    end

    def limit_clause
      ""
    end

    def materialized_views_used
      []
    end

    def query_without_materialized_views
      materialized_views_used.reduce(query) do |accumulator, view_name|
        get view from name
        accumulator.gsub(view_name, "(#{view_sql}) AS #{view_name}")
      end
    end
  end
end
