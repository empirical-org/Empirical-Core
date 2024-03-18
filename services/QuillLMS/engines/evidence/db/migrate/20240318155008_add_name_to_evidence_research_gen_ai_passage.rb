# frozen_string_literal: true

class AddNameToEvidenceResearchGenAiPassage < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_passages, :name, :string, null: false
  end
end
