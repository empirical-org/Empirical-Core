class CreateUserMilestones < ActiveRecord::Migration
  def change
    create_table :user_milestones do |t|
      t.integer :user_id, index: true, null: false
      t.integer :milestone_id, index: true, null: false
      t.timestamps
    end

    add_index :user_milestones, [:user_id, :milestone_id], unique: true
  end
end
