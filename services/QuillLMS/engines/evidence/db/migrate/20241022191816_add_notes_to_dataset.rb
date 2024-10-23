# frozen_string_literal: true

class AddNotesToDataset < ActiveRecord::Migration[7.1]
  def change
    add_column :evidence_research_gen_ai_datasets, :notes, :text
  end
end
