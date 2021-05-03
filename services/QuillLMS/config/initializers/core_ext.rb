module CoreExtensions
    module ActiveRecord 
        module Base
            def refresh_materialized_view(view_name)
                sql = "REFRESH MATERIALIZED VIEW CONCURRENTLY #{view_name}"
                ::ActiveRecord::Base.connection.execute(sql)
            end
        end
    end
end

ActiveRecord::Base.extend CoreExtensions::ActiveRecord::Base