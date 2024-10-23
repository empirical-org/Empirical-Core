# frozen_string_literal: true

# This migration comes from evidence (originally 20241022191816)
class AddNotesToDataset < ActiveRecord::Migration[7.1]
  def change
    add_column :evidence_research_gen_ai_datasets, :notes, :text
  end
end
