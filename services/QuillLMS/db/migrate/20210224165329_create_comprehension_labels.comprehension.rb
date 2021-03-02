# This migration comes from comprehension (originally 20210212194127)
class CreateComprehensionLabels < ActiveRecord::Migration
  def change
    create_table :comprehension_labels do |t|
      t.string :name, null: false
      t.references :rule, null: false

      t.timestamps null: false
    end
    add_foreign_key :comprehension_labels, :comprehension_rules, column: :rule_id, on_delete: :cascade
  end
end
