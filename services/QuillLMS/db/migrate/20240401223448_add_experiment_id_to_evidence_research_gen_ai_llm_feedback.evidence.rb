# frozen_string_literal: true

# This migration comes from evidence (originally 20240401223116)
class AddExperimentIdToEvidenceResearchGenAILLMFeedback < ActiveRecord::Migration[7.0]
  def change
    # rubocop:disable Rails/NotNullColumn
    add_column :evidence_research_gen_ai_llm_feedbacks, :experiment_id, :integer, null: false
    # rubocop:enable Rails/NotNullColumn
  end
end
