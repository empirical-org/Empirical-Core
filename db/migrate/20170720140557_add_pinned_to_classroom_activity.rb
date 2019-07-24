class AddPinnedToClassroomActivity < ActiveRecord::Migration
  def change
    add_column :classroom_activities, :pinned, :boolean, :default => false
    add_index :classroom_activities, [:classroom_id, :pinned], where: "pinned = true", unique: true
  end
end
