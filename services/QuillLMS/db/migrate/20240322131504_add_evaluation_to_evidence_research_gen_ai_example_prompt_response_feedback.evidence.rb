# frozen_string_literal: true

# This migration comes from evidence (originally 20240322131358)
class AddEvaluationToEvidenceResearchGenAIExamplePromptResponseFeedback < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_example_prompt_response_feedbacks, :evaluation, :text
  end
end
