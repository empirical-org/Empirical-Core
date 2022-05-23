# frozen_string_literal: true

class CreateResponsePrompt < ActiveRecord::Migration[5.1]
  def change
    create_table :response_prompts do |t|
      t.text :text, null: false

      t.datetime :created_at, null: false

      t.index :text, unique: true
    end
  end
end
