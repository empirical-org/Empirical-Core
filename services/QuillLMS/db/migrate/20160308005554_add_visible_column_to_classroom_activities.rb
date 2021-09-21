class AddVisibleColumnToClassroomActivities < ActiveRecord::Migration[4.2]
  def change
    add_column :classroom_activities, :visible, :boolean, null: false, default: true
  end
end
