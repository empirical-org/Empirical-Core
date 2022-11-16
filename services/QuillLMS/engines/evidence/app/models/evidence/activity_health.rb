module Evidence
  class ActivityHealth < ApplicationRecord
    ALLOWED_TOOLS = %w(connect grammar)
    FLAGS = [
      "production",
      "archived",
      "alpha",
      "beta",
      "gamma",
      "private",
      "Evidence Beta 1",
      "Evidence Beta 2",
      "College Board"
    ]

    has_many :prompt_healths, foreign_key: "evidence_activity_health_id", dependent: :destroy

    validates :flag, inclusion: { in: FLAGS, allow_nil: true}
    validates :version, numericality: { greater_than_or_equal_to: 1, allow_nil: true }
    validates :version_plays, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
    validates :total_plays, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
    validates :completion_rate, inclusion: { in: 0..100, allow_nil: true }
    validates :because_avg_attempts, inclusion: { in: 0..5, allow_nil: true }
    validates :but_avg_attempts, inclusion: { in: 0..5, allow_nil: true }
    validates :so_avg_attempts, inclusion: { in: 0..5, allow_nil: true }

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :name, :flag, :activity_id, :version,
          :version_plays, :total_plays, :completion_rate,
          :because_avg_attempts, :but_avg_attempts, :so_avg_attempts,
          :avg_completion_time
        ],
        include: [:prompt_healths]
      ))
    end
  end
end
