class AddIndexToClassrooms < ActiveRecord::Migration
  def change
    add_index :classrooms, :teacher_id
    add_index :classroom_activities, :updated_at
  end
end
