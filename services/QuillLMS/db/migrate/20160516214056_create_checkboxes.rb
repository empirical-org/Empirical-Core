# frozen_string_literal: true

class CreateCheckboxes < ActiveRecord::Migration[4.2]
  def change
    create_table :checkboxes do |t|
      t.integer :user_id
      t.integer :objective_id
      t.string :metadata, null: true
      t.timestamps null: false
    end
    add_index :checkboxes, [:user_id, :objective_id], :unique => true
  end
end
