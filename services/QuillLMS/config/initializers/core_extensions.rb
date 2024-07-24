# frozen_string_literal: true

Rails.application.config.to_prepare do
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

  ::Array.include CoreExtensions::Array
end

String.class_eval do
  # Source: https://unicode-explorer.com/articles/space-characters
  def strip_zero_width
    gsub(/[\u200B\u200C\u200D\uFEFF]/, '')
  end

  def strip_whitespace
    gsub(/\s/, '')
  end
end
