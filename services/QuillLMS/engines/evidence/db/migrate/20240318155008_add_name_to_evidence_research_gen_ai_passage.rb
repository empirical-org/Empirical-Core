# frozen_string_literal: true

class AddNameToEvidenceResearchGenAiPassage < ActiveRecord::Migration[7.0]
  def change
    # rubocop:disable Rails/NotNullColumn
    add_column :evidence_research_gen_ai_passages, :name, :string, null: false
    # rubocop:enable Rails/NotNullColumn
  end
end
