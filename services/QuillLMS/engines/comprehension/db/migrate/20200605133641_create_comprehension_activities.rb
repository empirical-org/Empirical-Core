class CreateComprehensionActivities < ActiveRecord::Migration
  def change
    create_table :comprehension_activities do |t|
      t.string :title, limit: 100
      t.integer :quill_activity_id
      t.integer :target_level, limit: 2
      t.string :scored_level, limit: 100

      t.timestamps null: false
    end
    add_index :comprehension_activities, :quill_activity_id
  end
end
