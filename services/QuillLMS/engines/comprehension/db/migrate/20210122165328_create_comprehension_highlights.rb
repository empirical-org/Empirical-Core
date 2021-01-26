class CreateComprehensionHighlights < ActiveRecord::Migration
  def change
    create_table :comprehension_highlights do |t|
      t.references :feedback, null: false
      t.string :text, null: false
      t.string :highlight_type, null: false
      t.integer :starting_index

      t.timestamps null: false
    end
    add_foreign_key :comprehension_highlights, :comprehension_feedbacks, column: :feedback_id, on_delete: :cascade
  end
end
