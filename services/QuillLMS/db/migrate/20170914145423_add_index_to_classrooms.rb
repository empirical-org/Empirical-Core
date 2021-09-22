class AddIndexToClassrooms < ActiveRecord::Migration[4.2]
  def change
    add_index :classrooms, :teacher_id
    add_index :classroom_activities, :updated_at
  end
end
