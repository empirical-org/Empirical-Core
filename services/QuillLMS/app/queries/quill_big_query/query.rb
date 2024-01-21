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
  end
end
