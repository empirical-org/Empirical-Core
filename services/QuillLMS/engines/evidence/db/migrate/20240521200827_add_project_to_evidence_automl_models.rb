# frozen_string_literal: true

class AddProjectToEvidenceAutomlModels < ActiveRecord::Migration[7.0]
  def up
    add_column :evidence_automl_models, :project, :string, null: true

    # Backfill the location column with the original location
    Evidence::AutomlModel.update_all(project: 'comprehension')

    change_column_null :evidence_automl_models, :project, false
  end

  def down
    remove_column :evidence_automl_models, :project
  end
end
