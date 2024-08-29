# frozen_string_literal: true

# This migration comes from evidence (originally 20240828221309)
class AddParentIdToEvidenceResearchGenAIDataset < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_datasets, :parent_id, :integer
  end
end
