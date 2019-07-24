class AddVisibleColumnToClassroomActivities < ActiveRecord::Migration
  def change
    add_column :classroom_activities, :visible, :boolean, null: false, default: true
  end
end
