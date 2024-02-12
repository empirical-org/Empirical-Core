# frozen_string_literal: true

module QuillBigQuery
  class RawSql < ::ApplicationService
    attr_reader :runner, :sql

    def initialize(sql, runner: QuillBigQuery::Runner)
      @runner = runner
      @sql = sql
    end

    def run = runner.execute(sql)
  end
end
