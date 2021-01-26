class CreatePlagiarismTextTable < ActiveRecord::Migration
  def change
    create_table :comprehension_plagiarism_texts do |t|
      t.references :rule, null: false
      t.string :text, null: false

      t.timestamps null: false
    end

    add_index :comprehension_plagiarism_texts, :rule_id, unique: true
    add_foreign_key :comprehension_plagiarism_texts, :comprehension_rules, column: :rule_id, on_delete: :cascade

  end
end
