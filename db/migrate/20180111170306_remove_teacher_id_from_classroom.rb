class RemoveTeacherIdFromClassroom < ActiveRecord::Migration
  def change
    remove_column :classrooms, :teacher_id, :integer
  end
end
