# frozen_string_literal: true

class AddChainOfThoughtToEvidenceResearchGenAIExampleFeedback < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_example_feedbacks, :chain_of_thought, :text
  end
end
