# frozen_string_literal: true

# This migration comes from evidence (originally 20240318155008)
class AddNameToEvidenceResearchGenAiPassage < ActiveRecord::Migration[7.0]
  def change
    # rubocop:disable Rails/NotNullColumn
    add_column :evidence_research_gen_ai_passages, :name, :string, null: false
    # rubocop:enable Rails/NotNullColumn
  end
end
