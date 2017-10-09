class ChangeDefaultAssignedStudentIds < ActiveRecord::Migration
  def change
    change_column_default :classroom_activities, :assigned_student_ids, nil
  end
end
