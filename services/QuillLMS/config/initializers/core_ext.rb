# frozen_string_literal: true

module CoreExtensions
  module ActiveRecord
    module Base
      def refresh_materialized_view(view_name, concurrently: true)
        concurrently_cmd = concurrently ? 'CONCURRENTLY' : nil
        sql = "REFRESH MATERIALIZED VIEW #{concurrently_cmd} #{view_name}"
        ::ActiveRecord::Base.connection.execute(sql)
      end
    end
  end
end

ActiveRecord::Base.extend CoreExtensions::ActiveRecord::Base
