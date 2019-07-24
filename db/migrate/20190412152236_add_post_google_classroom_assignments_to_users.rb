class AddPostGoogleClassroomAssignmentsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :post_google_classroom_assignments, :boolean
  end
end
