class AssociateRegexRuleWithRule < ActiveRecord::Migration
  def change
    add_reference :comprehension_regex_rules, :rule, index: true
    add_foreign_key :comprehension_regex_rules, :comprehension_rules, column: :rule_id, on_delete: :cascade
    change_column :comprehension_rules, :concept_uid, :string, null: true
  end
end
