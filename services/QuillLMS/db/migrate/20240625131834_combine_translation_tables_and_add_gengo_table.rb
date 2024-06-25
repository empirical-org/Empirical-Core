class CombineTranslationTablesAndAddGengoTable < ActiveRecord::Migration[7.0]
  def change
    drop_table :translated_texts
    rename_table :openai_translated_texts, :translated_texts
    add_column :translated_texts, :source_api, :string

  end
end
