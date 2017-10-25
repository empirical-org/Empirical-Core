class AddCompletedToClassroomActivity < ActiveRecord::Migration
  def change
    add_column :classroom_activities, :completed, :boolean, default: false
  end
end
