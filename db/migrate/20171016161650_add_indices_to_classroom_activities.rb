class AddIndicesToClassroomActivities < ActiveRecord::Migration
  def change
    add_index :classroom_activities, [:classroom_id, :activity_id, :unit_id], unique: true, name: :idx_class_act_on_class_act_and_unit, where: "classroom_activities.id > #{ClassroomActivity.last.id}"
  end
end
