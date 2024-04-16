# frozen_string_literal: true

class AddExperimentIdToEvidenceResearchGenAILLMFeedback < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_llm_feedbacks, :experiment_id, :integer, null: false
  end
end
