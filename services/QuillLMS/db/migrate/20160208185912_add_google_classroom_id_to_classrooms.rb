class AddGoogleClassroomIdToClassrooms < ActiveRecord::Migration
  def change
    add_column :classrooms, :google_classroom_id, :integer
  end
end
