# This migration comes from comprehension (originally 20210128155938)
class AssociateRegexRuleWithRule < ActiveRecord::Migration
  def change
    add_reference :comprehension_regex_rules, :rule, index: true
    add_foreign_key :comprehension_regex_rules, :comprehension_rules, column: :rule_id, on_delete: :cascade
<<<<<<< HEAD
=======
    change_column :comprehension_rules, :concept_uid, :string, null: true
>>>>>>> 8bfb6b2e9da3c4674eda62389cd1b6332283b046
  end
end
