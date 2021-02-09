# This migration comes from comprehension (originally 20210129184505)
class DeleteRuleSets < ActiveRecord::Migration
  def change
    drop_table :comprehension_rule_sets
    drop_table :comprehension_prompts_rule_sets
    remove_column :comprehension_regex_rules, :rule_set_id
  end
end
