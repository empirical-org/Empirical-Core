# frozen_string_literal: true

module Test
  module MultiDb
    class CustomResolver < ActiveRecord::Middleware::DatabaseSelector::Resolver
      delegate :log_db_selection, to: :context

      def read_from_primary(&blk)
        super do
          log_db_selection(__method__)
          yield
        end
      end

      def read_from_replica(&blk)
        super do
          log_db_selection(__method__)
          yield
        end
      end

      def write_to_primary(&blk)
        super do
          log_db_selection(__method__)
          yield
        end
      end
    end
  end
end
