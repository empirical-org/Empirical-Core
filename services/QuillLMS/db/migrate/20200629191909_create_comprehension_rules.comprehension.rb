# This migration comes from comprehension (originally 20200626160522)
class CreateComprehensionRules < ActiveRecord::Migration
  def change
    create_table :comprehension_rules do |t|
      t.integer :rule_set_id
      t.string :regex_text
      t.boolean :case_sensitive

      t.timestamps null: false
    end
    add_index :comprehension_rules, :rule_set_id
  end
end
