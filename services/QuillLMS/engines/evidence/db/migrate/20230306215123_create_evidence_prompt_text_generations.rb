class CreateEvidencePromptTextGenerations < ActiveRecord::Migration[6.1]
  def change
    create_table :evidence_text_generations do |t|
      t.string :name, null: false
      t.jsonb :data

      t.timestamps
    end
  end
end
