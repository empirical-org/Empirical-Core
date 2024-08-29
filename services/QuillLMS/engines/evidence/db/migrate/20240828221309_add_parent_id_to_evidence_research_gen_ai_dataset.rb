# frozen_string_literal: true

class AddParentIdToEvidenceResearchGenAIDataset < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_datasets, :parent_id, :integer
  end
end
