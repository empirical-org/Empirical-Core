# frozen_string_literal: true

class CreateEnglishTexts < ActiveRecord::Migration[7.0]
  def change
    create_table :english_texts do |t|
      t.text :text, null: false
      t.timestamps
    end
  end
end
