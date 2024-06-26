# frozen_string_literal: true

class CreateOpenaiTranslatedTexts < ActiveRecord::Migration[7.0]
  def change
    create_table :openai_translated_texts do |t|
      t.integer :english_text_id, null: false
      t.text :translation, null: false
      t.string :locale, null: false
      t.timestamps
    end
  end
end
