class CreateTranslationMappings < ActiveRecord::Migration[7.0]
  def change
    create_table :translation_mappings do |t|
      t.integer :english_text_id, null: false
      t.string :source_type, null: false
      t.integer :source_id, null: false
      t.string :source_key
      t.timestamps
    end
  end
end
