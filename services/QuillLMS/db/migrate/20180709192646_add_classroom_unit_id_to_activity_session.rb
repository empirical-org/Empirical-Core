class AddClassroomUnitIdToActivitySession < ActiveRecord::Migration
  def change
    add_column :activity_sessions, :classroom_unit_id, :integer
  end
end
