class CreateComprehensionAutomlModels < ActiveRecord::Migration
  def change
    create_table :comprehension_automl_models do |t|
      t.string :automl_model_id, null: false, unique: true
      t.string :name, null: false
      t.string :labels, array: true, default: []
      t.references :prompt
      t.string :state, null: false

      t.timestamps null: false
    end
    add_foreign_key :comprehension_automl_models, :comprehension_prompts, column: :prompt_id
  end
end
