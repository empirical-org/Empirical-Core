# frozen_string_literal: true

# This migration comes from evidence (originally 20241004133206)
class AddAutomlDataToEvidenceResearchGenAIStemVaults < ActiveRecord::Migration[7.1]
  def change
    add_column :evidence_research_gen_ai_stem_vaults, :automl_data, :jsonb, default: {}, null: false
  end
end
