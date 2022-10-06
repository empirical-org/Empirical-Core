# frozen_string_literal: true

class AddHintName < ActiveRecord::Migration[6.1]
  def change
    add_column :evidence_hints, :name, :text
    change_column_null :evidence_hints, :rule_id, true

    add_reference :comprehension_rules, :hint
  end
end
