# frozen_string_literal: true

class AddPromptIdToStemVault < ActiveRecord::Migration[7.1]
  def change
    add_column :evidence_research_gen_ai_stem_vaults, :prompt_id, :integer
  end
end
