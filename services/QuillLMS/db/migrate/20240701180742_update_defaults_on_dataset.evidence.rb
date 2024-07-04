# frozen_string_literal: true

# This migration comes from evidence (originally 20240701180438)
class UpdateDefaultsOnDataset < ActiveRecord::Migration[7.0]
  def change
    change_column_default :evidence_research_gen_ai_datasets, :locked, from: nil, to: false
    change_column_default :evidence_research_gen_ai_datasets, :optimal_count, from: nil, to: 0
    change_column_default :evidence_research_gen_ai_datasets, :suboptimal_count, from: nil, to: 0
  end
end
