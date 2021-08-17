require "active_support/concern"

module ResponsesView
  extend ActiveSupport::Concern

  included do
    self.primary_key = :id

    scope :optimal, -> { where(optimal: true) }
    scope :nonoptimal, -> { where(optimal: [false, nil]) }
    scope :no_parent, -> { where(parent_id: nil) }

    def self.refresh
      Scenic.database.refresh_materialized_view(table_name, concurrently: true, cascade: false)
    end
  end

  def readonly?
    true
  end
end
