class CreateEvidencePromptTexts < ActiveRecord::Migration[6.1]
  def change
    create_table :evidence_prompt_texts do |t|
      t.integer :prompt_text_batch_id, null: false
      t.integer :text_generation_id, null: false
      t.string :text, null: false
      t.string :label
      t.string :ml_type

      t.timestamps
    end
  end
end
