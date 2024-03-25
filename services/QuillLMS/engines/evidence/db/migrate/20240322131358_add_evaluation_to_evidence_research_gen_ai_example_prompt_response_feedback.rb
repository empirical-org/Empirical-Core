# frozen_string_literal: true

class AddEvaluationToEvidenceResearchGenAIExamplePromptResponseFeedback < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_example_prompt_response_feedbacks, :evaluation, :text
  end
end
