# This migration comes from comprehension (originally 20210122144228)
class CreateComprehensionPromptsRules < ActiveRecord::Migration
  def change
    create_table :comprehension_prompts_rules do |t|
      t.references :prompt, null: false
      t.references :rule, null: false

      t.timestamps null: false
    end
    add_index :comprehension_prompts_rules, [:prompt_id, :rule_id], unique: true
    add_index :comprehension_prompts_rules, :rule_id
  end
end
