# frozen_string_literal: true

# This migration comes from evidence (originally 20240531183845)
class RenameExperimentToTrial < ActiveRecord::Migration[7.0]
  def change
    rename_column :evidence_research_gen_ai_experiments, :experiment_duration, :trial_duration
    rename_column :evidence_research_gen_ai_experiments, :experiment_errors, :trial_errors
    rename_column :evidence_research_gen_ai_llm_feedbacks, :experiment_id, :trial_id

    rename_table :evidence_research_gen_ai_experiments, :evidence_research_gen_ai_trials
  end
end
