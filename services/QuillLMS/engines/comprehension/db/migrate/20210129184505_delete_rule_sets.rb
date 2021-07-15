class DeleteRuleSets < ActiveRecord::Migration[4.2]
  def change
    drop_table :comprehension_rule_sets
    drop_table :comprehension_prompts_rule_sets
    remove_column :comprehension_regex_rules, :rule_set_id
  end
end
