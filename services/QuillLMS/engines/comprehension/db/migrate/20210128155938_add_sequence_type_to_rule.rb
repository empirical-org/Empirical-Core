class AddSequenceTypeToRule < ActiveRecord::Migration
  def change
    add_column :comprehension_rules, :sequence_type, :string
    add_reference :comprehension_regex_rules, :rule, index: true
    add_foreign_key :comprehension_regex_rules, :comprehension_rules, column: :rule_id, on_delete: :cascade
  end
end
