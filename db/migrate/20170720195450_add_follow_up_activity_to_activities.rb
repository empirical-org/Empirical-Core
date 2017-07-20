class AddFollowUpActivityToActivities < ActiveRecord::Migration
  def change
    add_reference :activities, :follow_up_activity_id, foreign_key: true
  end
end
