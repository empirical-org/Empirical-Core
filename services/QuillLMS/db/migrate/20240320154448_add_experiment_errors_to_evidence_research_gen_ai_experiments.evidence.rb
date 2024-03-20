# frozen_string_literal: true

# This migration comes from evidence (originally 20240320152621)
class AddExperimentErrorsToEvidenceResearchGenAiExperiments < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_experiments, :experiment_errors, :text, array: true
  end
end
