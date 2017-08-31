class AddFollowUpActivityToActivities < ActiveRecord::Migration
  def change
    add_reference :activities, :follow_up_activity, foreign_key: false
  end
end
