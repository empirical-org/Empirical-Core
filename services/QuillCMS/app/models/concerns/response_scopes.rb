require "active_support/concern"

module ResponseScopes
  extend ActiveSupport::Concern

  included do
    scope :optimal, -> { where(optimal: true) }
    scope :graded_nonoptimal, -> { where(optimal: false) }
    scope :ungraded, -> { where(optimal: nil) }
    scope :nonoptimal, -> { where(optimal: [false, nil]) }

    scope :no_parent, -> { where(parent_id: nil) }
  end
end
