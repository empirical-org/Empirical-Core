class AddGoogleClassroomIdIndexToClassroom < ActiveRecord::Migration[5.1]
  def change
    add_index :classrooms, :google_classroom_id
  end
end
