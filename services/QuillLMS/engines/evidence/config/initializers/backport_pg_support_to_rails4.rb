# frozen_string_literal: true

# Bugfix for Rails- Hitting an issue with tests at the DB level:
# ActiveRecord::StatementInvalid: PG::UndefinedColumn: ERROR:  column "increment_by" does not exist
# LINE 1: ...mpts_id_seq"', (SELECT COALESCE(MAX("id")+(SELECT increment_...
# Found this patch: https://github.com/rails/rails/issues/28780#issuecomment-354868174

require 'active_record/connection_adapters/postgresql/schema_statements'

#
# Monkey-patch the refused Rails 4.2 patch at https://github.com/rails/rails/pull/31330
#
# Updates sequence logic to support PostgreSQL 10.
#

module ActiveRecord
  module ConnectionAdapters
    module PostgreSQL
      module SchemaStatements
        # Resets the sequence of a table's primary key to the maximum value.
        # rubocop:disable Metrics/CyclomaticComplexity
        def reset_pk_sequence!(table, primary_key = nil, sequence = nil) #:nodoc:
          unless primary_key && sequence
            default_pk, default_sequence = pk_and_sequence_for(table)

            primary_key ||= default_pk
            sequence ||= default_sequence
          end

          if @logger && primary_key && !sequence
            @logger.warn "#{table} has primary key #{primary_key} with no default sequence"
          end

          return unless primary_key && sequence

          quoted_sequence = quote_table_name(sequence)
          max_pk = select_value("SELECT MAX(#{quote_column_name primary_key}) FROM #{quote_table_name(table)}")
          if max_pk.nil?
            if postgresql_version >= 100000
              minvalue = select_value("SELECT seqmin FROM pg_sequence WHERE seqrelid = #{quote(quoted_sequence)}::regclass")
            else
              minvalue = select_value("SELECT min_value FROM #{quoted_sequence}")
            end
          end

          select_value <<-SQL, 'SCHEMA'
            SELECT setval(#{quote(quoted_sequence)}, #{max_pk || minvalue}, #{max_pk ? true : false})
          SQL
        end
        # rubocop:enable Metrics/CyclomaticComplexity
      end
    end
  end
end
