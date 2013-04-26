class CreateScores < ActiveRecord::Migration
  def change
    create_table :scores do |t|
      t.integer :user_id
      t.integer :assignment_id
      t.datetime :completion_date
      t.integer :items_missed
      t.integer :lessons_completed

      t.timestamps
    end
  end
end
