# frozen_string_literal: true

# This migration comes from comprehension (originally 20210128155938)
class AssociateRegexRuleWithRule < ActiveRecord::Migration[4.2]
  def change
    add_reference :comprehension_regex_rules, :rule, index: true
    add_foreign_key :comprehension_regex_rules, :comprehension_rules, column: :rule_id, on_delete: :cascade
    change_column :comprehension_rules, :concept_uid, :string, null: true
  end
end
