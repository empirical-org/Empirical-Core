# frozen_string_literal: true

# This migration comes from evidence (originally 20230306215123)
class CreateEvidenceTextGenerations < ActiveRecord::Migration[6.1]
  def change
    create_table :evidence_text_generations do |t|
      t.string :type, null: false
      t.jsonb :config

      t.timestamps
    end
  end
end
