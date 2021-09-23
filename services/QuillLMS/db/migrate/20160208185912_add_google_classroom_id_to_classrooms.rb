class AddGoogleClassroomIdToClassrooms < ActiveRecord::Migration[4.2]
  def change
    add_column :classrooms, :google_classroom_id, :integer
  end
end
