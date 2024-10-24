# frozen_string_literal: true

class AddStemVaultIdToRelevantTexts < ActiveRecord::Migration[7.1]
  def change
    add_column :evidence_research_gen_ai_relevant_texts, :stem_vault_id, :integer
  end
end
