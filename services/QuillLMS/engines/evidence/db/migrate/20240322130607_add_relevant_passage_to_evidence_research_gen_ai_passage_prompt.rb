# frozen_string_literal: true

class AddRelevantPassageToEvidenceResearchGenAIPassagePrompt < ActiveRecord::Migration[7.0]
  def change
    # rubocop:disable Rails/NotNullColumn
    add_column :evidence_research_gen_ai_passage_prompts, :relevant_passage, :text, null: false
    # rubocop:enable Rails/NotNullColumn
  end
end
