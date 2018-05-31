class ChangeDefaultClassroomActivityColumnsAgain < ActiveRecord::Migration
  def change
    change_column_default :classroom_activities, :assign_on_join, nil
  end
end
