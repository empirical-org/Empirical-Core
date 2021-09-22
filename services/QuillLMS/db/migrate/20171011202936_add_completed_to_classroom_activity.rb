class AddCompletedToClassroomActivity < ActiveRecord::Migration[4.2]
  def change
    add_column :classroom_activities, :completed, :boolean, default: false
  end
end
