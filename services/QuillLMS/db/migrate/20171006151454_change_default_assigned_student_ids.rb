class ChangeDefaultAssignedStudentIds < ActiveRecord::Migration[4.2]
  def change
    change_column_default :classroom_activities, :assigned_student_ids, nil
  end
end
