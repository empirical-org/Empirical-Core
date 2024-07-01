# frozen_string_literal: true

# This migration comes from evidence (originally 20240625135430)
class AddVersionToDataset < ActiveRecord::Migration[7.0]
  def change
    add_column :evidence_research_gen_ai_datasets, :version, :integer

    Evidence::Research::GenAI::Dataset.reset_column_information
    Evidence::Research::GenAI::Dataset.find_each do |dataset|
      existing_version =
        Evidence::Research::GenAI::Dataset
          .where(stem_vault_id: dataset.stem_vault_id)
          .where.not(id: dataset.id)
          .order(version: :desc)
          .first&.version


      Evidence::Research::GenAI::Dataset
        .where(id: dataset.id)
        .update_all(version: existing_version.is_a?(Integer) ? existing_version + 1 : 1)
    end

    change_column_null :evidence_research_gen_ai_datasets, :version, false
  end
end
