# frozen_string_literal: true

class CreateEvidencePromptHealths < ActiveRecord::Migration[6.1]
  def change
    create_table :evidence_prompt_healths do |t|
      t.integer     :prompt_id, null: false
      t.string      :activity_short_name, null: false
      t.string      :text, null: false
      t.integer     :current_version, null: false
      t.integer     :version_responses, null: false
      t.integer     :first_attempt_optimal
      t.integer     :final_attempt_optimal
      t.float       :avg_attempts
      t.float       :confidence
      t.integer     :percent_automl_consecutive_repeated
      t.integer     :percent_automl
      t.integer     :percent_plagiarism
      t.integer     :percent_opinion
      t.integer     :percent_grammar
      t.integer     :percent_spelling
      t.integer     :avg_time_spent_per_prompt

      t.references  :evidence_activity_health

      t.timestamps
    end
    add_foreign_key :evidence_prompt_healths, :evidence_activity_healths, column: :evidence_activity_health_id, on_delete: :cascade
  end
end
