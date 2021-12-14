require "active_support/concern"

module ResponseView
  extend ActiveSupport::Concern

  included do
    self.primary_key = :id

    def self.refresh
      Scenic.database.refresh_materialized_view(table_name, concurrently: true, cascade: false)
    end
  end

  def readonly?
    true
  end
end
