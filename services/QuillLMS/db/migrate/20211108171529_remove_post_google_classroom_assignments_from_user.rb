class RemovePostGoogleClassroomAssignmentsFromUser < ActiveRecord::Migration[5.1]
  def change
    remove_column :users, :post_google_classroom_assignments, :boolean
  end
end
