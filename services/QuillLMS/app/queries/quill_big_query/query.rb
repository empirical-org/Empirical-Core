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
        view = MaterializedView.fetch(view_name)

        # If there is already an AS clause for this view, keep it
        return accumulator.gsub(view[:name], "(#{view[:sql]})") if accumulator =~ /#{view[:name]}\s+as\s+[^\s]+/i

        name_without_namespace = view[:name].split(",", 2).second

        accumulator.gsub(view[:name], "(#{view[:sql]}) AS #{name_without_namespace}")
      end
    end
  end
end
