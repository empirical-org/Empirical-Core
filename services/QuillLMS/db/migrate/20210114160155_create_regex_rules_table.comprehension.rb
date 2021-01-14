# This migration comes from comprehension (originally 20210114154926)
class CreateRegexRulesTable < ActiveRecord::Migration
  def change
    create_table :comprehension_regex_rules do |t|
      t.integer :rule_set_id
      t.string :regex_text, limit: 200
      t.boolean :case_sensitive

      t.timestamps null: false
    end
    add_index :comprehension_regex_rules, :rule_set_id

    execute "INSERT INTO comprehension_regex_rules SELECT * FROM comprehension_rules"
  end
end
