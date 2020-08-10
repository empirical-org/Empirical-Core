# This migration comes from comprehension (originally 20200609005839)
class CreateComprehensionPrompts < ActiveRecord::Migration
  def change
    create_table :comprehension_prompts do |t|
      t.integer :activity_id
      t.integer :max_attempts, limit: 1
      t.string :conjunction, limit: 20
      t.string :text
      t.text :max_attempts_feedback

      t.timestamps null: false
    end

    add_index :comprehension_prompts, :activity_id
  end
end
