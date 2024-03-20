# frozen_string_literal: true

class AddExperimentErrorsToEvidenceResearchGenAiExperiments < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_experiments, :experiment_errors, :text, array: true
  end
end
