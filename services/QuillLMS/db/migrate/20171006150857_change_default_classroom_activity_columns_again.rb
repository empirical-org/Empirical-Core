class ChangeDefaultClassroomActivityColumnsAgain < ActiveRecord::Migration[4.2]
  def change
    change_column_default :classroom_activities, :assign_on_join, nil
  end
end
