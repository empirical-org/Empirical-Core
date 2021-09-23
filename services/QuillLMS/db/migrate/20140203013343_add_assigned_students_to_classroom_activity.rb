class AddAssignedStudentsToClassroomActivity < ActiveRecord::Migration[4.2]
  def change
    change_table :classroom_activities do |t|
      t.integer :assigned_student_ids, array: true
    end
  end
end
