class ChangeClassroomUnitActivityStatesDataDefault < ActiveRecord::Migration
  def up
    change_column_default :classroom_unit_activity_states, :data, {}
  end

  def down
    change_column_default :classroom_unit_activity_states, :data, '{}'
  end
end
