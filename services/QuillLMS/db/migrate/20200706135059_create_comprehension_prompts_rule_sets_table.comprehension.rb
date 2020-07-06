# This migration comes from comprehension (originally 20200626181312)
class CreateComprehensionPromptsRuleSetsTable < ActiveRecord::Migration
  def change
    create_table :comprehension_prompts_rule_sets do |t|
      t.integer :prompt_id
      t.integer :rule_set_id
    end
    add_index :comprehension_prompts_rule_sets, :prompt_id
    add_index :comprehension_prompts_rule_sets, :rule_set_id
  end
end
