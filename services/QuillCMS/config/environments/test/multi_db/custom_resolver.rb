module Test
  module MultiDb
    class CustomResolver < ActiveRecord::Middleware::DatabaseSelector::Resolver
      delegate :log_db_selection, to: :context

      def read_from_primary(&)
        super do
          log_db_selection(__method__)
          yield
        end
      end

      def read_from_replica(&)
        super do
          log_db_selection(__method__)
          yield
        end
      end

      def write_to_primary(&)
        super do
          log_db_selection(__method__)
          yield
        end
      end
    end
  end
end