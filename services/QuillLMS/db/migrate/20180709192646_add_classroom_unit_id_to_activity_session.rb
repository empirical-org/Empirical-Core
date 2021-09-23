class AddClassroomUnitIdToActivitySession < ActiveRecord::Migration[4.2]
  def change
    add_column :activity_sessions, :classroom_unit_id, :integer
  end
end
