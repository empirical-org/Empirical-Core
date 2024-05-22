# frozen_string_literal: true

class CreateEvidenceAutomlModels < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_automl_models do |t|
      t.string :model_external_id, null: false, unique: true
      t.string :endpoint_external_id, null: false, unique: true
      t.string :name, null: false
      t.string :labels, array: true, default: []
      t.references :prompt
      t.string :state, null: false
      t.text :notes, default: ''

      t.timestamps null: false
    end

    add_foreign_key :evidence_automl_models, :comprehension_prompts, column: :prompt_id
  end
end
