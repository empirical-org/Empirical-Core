class CreateComprehensionPassages < ActiveRecord::Migration
  def change
    create_table :comprehension_passages do |t|
      t.integer :activity_id
      t.text :text

      t.timestamps null: false
    end
    add_index :comprehension_passages, :activity_id
  end
end
