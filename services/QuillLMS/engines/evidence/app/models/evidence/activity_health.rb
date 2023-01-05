# frozen_string_literal: true

module Evidence
  class ActivityHealth < ApplicationRecord

    POOR_HEALTH_CUTOFF = 75

    has_many :prompt_healths, foreign_key: "evidence_activity_health_id", dependent: :destroy

    validates :flag, inclusion: { in: Evidence.flags_class::FLAGS, allow_nil: true}
    validates :version, numericality: { greater_than_or_equal_to: 1, allow_nil: true }
    validates :version_plays, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
    validates :total_plays, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
    validates :completion_rate, inclusion: { in: 0..100, allow_nil: true }
    validates :because_final_optimal, inclusion: { in: 0..100, allow_nil: true }
    validates :but_final_optimal, inclusion: { in: 0..100, allow_nil: true }
    validates :so_final_optimal, inclusion: { in: 0..100, allow_nil: true }

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [
          :id, :name, :flag, :activity_id, :version,
          :version_plays, :total_plays, :completion_rate,
          :because_final_optimal, :but_final_optimal, :so_final_optimal,
          :avg_completion_time
        ],
        include: [:prompt_healths],
        methods: [:poor_health_flag]
      ))
    end

    def poor_health_flag
      (because_final_optimal && because_final_optimal < POOR_HEALTH_CUTOFF) || (but_final_optimal && but_final_optimal < POOR_HEALTH_CUTOFF) || (so_final_optimal && so_final_optimal < POOR_HEALTH_CUTOFF)
    end
  end
end
