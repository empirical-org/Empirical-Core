class ChangeClassroomUnitActivityStatesDataDefault < ActiveRecord::Migration[4.2]
  def up
    change_column_default :classroom_unit_activity_states, :data, {}
  end

  def down
    change_column_default :classroom_unit_activity_states, :data, '{}'
  end
end
