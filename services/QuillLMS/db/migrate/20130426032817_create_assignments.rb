class CreateAssignments < ActiveRecord::Migration[4.2]
  def change
    create_table :assignments do |t|
      t.integer :user_id
      t.integer :classcode
      t.integer :chapter_id
      t.datetime :due_date

      t.timestamps
    end
  end
end
