class CreateComprehensionRuleSets < ActiveRecord::Migration
  def change
    create_table :comprehension_rule_sets do |t|
      t.integer :activity_id
      t.integer :prompt_id
      t.string :name, limit: 100
      t.text :feedback
      t.integer :priority, limit: 2

      t.timestamps null: false
    end
    add_index :comprehension_rule_sets, :activity_id
    add_index :comprehension_rule_sets, :prompt_id
  end
end
