# frozen_string_literal: true

class CreateRuleHint < ActiveRecord::Migration[6.1]
  def change
    create_table :evidence_rule_hints do |t|
      t.references :rule, null: false
      t.references :hint, null: false

      t.timestamps
    end
    add_foreign_key :evidence_rule_hints, :comprehension_rules, column: :rule_id, on_delete: :cascade
    add_foreign_key :evidence_rule_hints, :evidence_hints, column: :hint_id, on_delete: :cascade
  end
end
