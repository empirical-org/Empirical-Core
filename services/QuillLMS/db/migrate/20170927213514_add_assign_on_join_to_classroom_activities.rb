class AddAssignOnJoinToClassroomActivities < ActiveRecord::Migration[4.2]
  def change
    add_column :classroom_activities, :assign_on_join, :boolean
  end
end
