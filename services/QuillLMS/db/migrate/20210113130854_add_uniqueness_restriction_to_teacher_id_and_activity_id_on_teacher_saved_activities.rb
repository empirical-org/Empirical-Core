class AddUniquenessRestrictionToTeacherIdAndActivityIdOnTeacherSavedActivities < ActiveRecord::Migration[4.2]
  def change
    add_index :teacher_saved_activities, [:teacher_id, :activity_id], unique: true
  end
end
