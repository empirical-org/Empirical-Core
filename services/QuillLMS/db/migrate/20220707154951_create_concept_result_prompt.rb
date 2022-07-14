# frozen_string_literal: true

class CreateConceptResultPrompt < ActiveRecord::Migration[5.1]
  def change
    create_table :concept_result_prompts, id: false do |t|
      t.serial :id, limit: 4, primary_key: true

      t.text :text, null: false

      t.datetime :created_at, null: false

      t.index :text, unique: true
    end
  end
end
