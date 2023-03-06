class CreateEvidencePromptTextGenerations < ActiveRecord::Migration[6.1]
  def change
    create_table :evidence_prompt_text_generations do |t|
      t.string :generator, null: false
      t.string :source_text
      t.text :ml_prompt_text
      t.jsonb :metadata

      t.timestamps
    end
  end
end
