class AddAssignOnJoinToClassroomActivities < ActiveRecord::Migration
  def change
    add_column :classroom_activities, :assign_on_join, :boolean
  end
end
