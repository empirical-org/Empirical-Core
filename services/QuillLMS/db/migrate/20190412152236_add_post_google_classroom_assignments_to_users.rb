class AddPostGoogleClassroomAssignmentsToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :post_google_classroom_assignments, :boolean
  end
end
