class CreateComprehensionRules < ActiveRecord::Migration[4.2]
  def change
    create_table :comprehension_rules do |t|
      t.integer :rule_set_id
      t.string :regex_text, limit: 200
      t.boolean :case_sensitive

      t.timestamps null: false
    end
    add_index :comprehension_rules, :rule_set_id
  end
end
