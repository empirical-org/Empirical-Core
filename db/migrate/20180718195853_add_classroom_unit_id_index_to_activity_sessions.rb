class AddClassroomUnitIdIndexToActivitySessions < ActiveRecord::Migration
  def change
    add_index :activity_sessions, [:classroom_unit_id]
  end
end
