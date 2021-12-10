# frozen_string_literal: true

# This migration comes from comprehension (originally 20210114182832)
class CreateComprehensionRulesTable < ActiveRecord::Migration[4.2]
  def change
    create_table :comprehension_rules do |t|
      t.string :uid, null: false
      t.string :name, null: false
      t.string :description
      t.boolean :universal, null: false
      t.string :rule_type, null: false
      t.boolean :optimal, null: false
      t.integer :suborder
      t.string :concept_uid, null: false

      t.timestamps null: false
    end
    add_index :comprehension_rules, :uid, unique: true
  end
end
