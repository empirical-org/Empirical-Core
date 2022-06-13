# frozen_string_literal: true

class CreateEvidenceHints < ActiveRecord::Migration[5.1]
  def change
    create_table :evidence_hints do |t|
      t.string :explanation, null: false
      t.string :image_link, null: false
      t.string :image_alt_text, null: false
      t.references :rule, null: false, index: true

      t.timestamps null: false
    end
  end
end
