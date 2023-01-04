# frozen_string_literal: true

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

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [
          :id, :current_version, :version_responses, :first_attempt_optimal, :final_attempt_optimal,
          :avg_attempts, :confidence, :percent_automl_consecutive_repeated, :percent_automl,
          :percent_plagiarism, :percent_opinion, :percent_grammar, :percent_spelling, :text,
          :avg_time_spent_per_prompt, :prompt_id, :activity_short_name
        ],
        methods: [:conjunction, :activity_id, :flag]
      ))
    end

    def conjunction
      prompt.conjunction
    end

    def activity_id
      prompt.activity_id
    end

    def flag
      prompt.activity.flag
    end

    private def prompt
      @prompt ||= Prompt.find(prompt_id)
    end
  end
end
