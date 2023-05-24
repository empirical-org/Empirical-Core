# frozen_string_literal: true

module Snapshots
  class TopXQuery < PeriodQuery
    NUMBER_OF_RECORDS = 3

    def run
      run_query
    end

    def select_clause
      <<-SQL
        SELECT #{relevant_group_column} AS value, COUNT(#{relevant_count_column}) AS count
      SQL
    end

    def relevant_group_column
      raise NotImplementedError
    end

    def relevant_count_column
      "*"
    end

    def group_by_clause
      "GROUP BY #{relevant_group_column}"
    end

    def order_by_clause
      "ORDER BY COUNT(#{relevant_group_column}) DESC"
    end

    def limit_clause
      "LIMIT #{NUMBER_OF_RECORDS}"
    end
  end
end
