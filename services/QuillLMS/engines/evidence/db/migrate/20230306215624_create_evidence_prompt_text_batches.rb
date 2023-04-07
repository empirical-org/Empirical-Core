class CreateEvidencePromptTextBatches < ActiveRecord::Migration[6.1]
  def change
    create_table :evidence_prompt_text_batches do |t|
      t.string :type, null: false
      t.integer :prompt_id, null: false
      t.integer :user_id
      t.jsonb :data

      t.timestamps
    end
  end
end
