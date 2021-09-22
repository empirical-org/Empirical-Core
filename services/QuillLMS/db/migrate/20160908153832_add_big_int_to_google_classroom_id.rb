class AddBigIntToGoogleClassroomId < ActiveRecord::Migration[4.2]
  def change
    change_column :classrooms, :google_classroom_id, :integer, limit: 8
  end
end
