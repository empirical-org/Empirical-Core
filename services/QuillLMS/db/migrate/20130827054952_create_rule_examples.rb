class CreateRuleExamples < ActiveRecord::Migration
  def change
    create_table :rule_examples do |t|
      t.text :title
      t.boolean :correct, default: false, null: false
      t.text :text
      t.belongs_to :rule

      t.timestamps
    end
  end
end
