class AddLockedByDefaultToActivityClassificationAndLockedToClassroomActivity < ActiveRecord::Migration[4.2]
  def change
    add_column :activity_classifications, :locked_by_default, :boolean, default: false
    add_column :classroom_activities, :locked, :boolean, default: false
  end
end
