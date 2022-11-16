module Evidence
  class PromptHealth < ApplicationRecord

    belongs_to :activity_health, foreign_key: "evidence_activity_health_id"

    validates :current_version, numericality: { greater_than_or_equal_to: 1, allow_nil: true }
    validates :version_responses, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
    validates :first_attempt_optimal, inclusion: { in: 0..100, allow_nil: true }
    validates :final_attempt_optimal, inclusion: { in: 0..100, allow_nil: true }
    validates :avg_attempts, inclusion: { in: 0..5, allow_nil: true }
    validates :confidence, inclusion: { in: 0..1, allow_nil: true }
    validates :percent_automl_consecutive_repeated, inclusion: { in: 0..100, allow_nil: true }
    validates :percent_automl, inclusion: { in: 0..100, allow_nil: true }
    validates :percent_plagiarism, inclusion: { in: 0..100, allow_nil: true }
    validates :percent_opinion, inclusion: { in: 0..100, allow_nil: true }
    validates :percent_grammar, inclusion: { in: 0..100, allow_nil: true }
    validates :percent_spelling, inclusion: { in: 0..100, allow_nil: true }
  end
end
