class CreateTranslatedTexts < ActiveRecord::Migration[7.0]
  def change
    create_table :translated_texts do |t|
      t.integer :english_text_id
      t.text :translation
      t.string :locale, null: false
      t.string :translation_job_id, null: false

      t.timestamps
    end
  end
end
