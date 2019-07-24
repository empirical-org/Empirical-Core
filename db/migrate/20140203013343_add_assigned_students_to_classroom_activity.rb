class AddAssignedStudentsToClassroomActivity < ActiveRecord::Migration
  def change
    change_table :classroom_activities do |t|
      t.integer :assigned_student_ids, array: true
    end
  end
end
