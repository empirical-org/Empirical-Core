class CreateEvidencePromptTexts < ActiveRecord::Migration[6.1]
  def change
    create_table :evidence_prompt_texts do |t|
      t.integer :prompt_text_batch_id, null: false
      t.integer :prompt_text_generation_id, null: false
      t.string :text, null: false
      t.string :label

      t.timestamps
    end
  end
end
