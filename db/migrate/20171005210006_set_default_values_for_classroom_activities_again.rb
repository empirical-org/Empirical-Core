class SetDefaultValuesForClassroomActivitiesAgain < ActiveRecord::Migration
  def change
    change_column_default :classroom_activities, :assigned_student_ids, nil
    change_column_default :classroom_activities, :assign_on_join, false
  end
end
