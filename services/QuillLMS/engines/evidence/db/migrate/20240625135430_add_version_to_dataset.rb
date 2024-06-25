# frozen_string_literal: true

class AddVersionToDataset < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_datasets, :version, :integer

    Evidence::Research::GenAI::Dataset.all.each { |dataset| dataset.update!(version: 1) }

    change_column_null :evidence_research_gen_ai_datasets, :version, false
  end
end
