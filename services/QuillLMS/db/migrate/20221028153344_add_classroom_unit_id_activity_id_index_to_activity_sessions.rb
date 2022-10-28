class AddClassroomUnitIdActivityIdIndexToActivitySessions < ActiveRecord::Migration[6.1]
  def change
    add_index :activity_sessions, [:activity_id, :classroom_unit_id]
  end
end
