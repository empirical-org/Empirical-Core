class AddBigIntToGoogleClassroomId < ActiveRecord::Migration
  def change
    change_column :classrooms, :google_classroom_id, :integer, limit: 8
  end
end
