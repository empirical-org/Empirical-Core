class AddAssignedToEntireClassroomToClassroomActivities < ActiveRecord::Migration
  def change
    add_column :classroom_activities, :assigned_to_entire_classroom, :boolean
  end
end
