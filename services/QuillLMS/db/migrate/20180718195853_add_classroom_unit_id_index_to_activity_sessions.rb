class AddClassroomUnitIdIndexToActivitySessions < ActiveRecord::Migration[4.2]
  def change
    add_index :activity_sessions, [:classroom_unit_id]
  end
end
