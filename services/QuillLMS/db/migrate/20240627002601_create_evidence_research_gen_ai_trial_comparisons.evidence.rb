# frozen_string_literal: true

# This migration comes from evidence (originally 20240627002301)
class CreateEvidenceResearchGenAITrialComparisons < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_trial_comparisons do |t|
      t.integer :comparison_id, null: false
      t.integer :trial_id, null: false

      t.timestamps
    end
  end
end
