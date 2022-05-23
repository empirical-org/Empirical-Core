# frozen_string_literal: true

class CreateResponseInstructions < ActiveRecord::Migration[5.1]
  def change
    create_table :response_instructions do |t|
      t.text :text, null: false

      t.datetime :created_at, null: false

      t.index :text, unique: true
    end
  end
end
